import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as React from 'react';
import ReactMapboxGl, { Feature, Layer, Marker, } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import * as mapActions from '../../actions/mapActions';
import * as tcroActions from '../../actions/tcroActions';
import { MAPBOX_ACCESS_TOKEN } from '../../constants';
import { BountyFilter, TxnStates } from '../../reducers/dataTypeEnums';
import * as Web3Utils from '../../utils/web3-utils';
import ContributionModal from './../ContributionModal';
import MapPopup from './../MapPopup';
const turf = require('@turf/turf');
const geolib = require('geolib');

const Map = ReactMapboxGl({
  accessToken: MAPBOX_ACCESS_TOKEN
});

const mapStyle = 'mapbox://styles/mapbox/dark-v9';

const styles = {
  map: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  } as React.CSSProperties
};


export interface IProps {
  center?: number[];
  zoom?: [number];
  web3: any;
  bounties: [any];
  setBounties: () => any;
  setMapPolygonPoints: (location: any) => any;
  setStakingPoolSize: (size: number) => any;
  stakingPoolSize: number;
  bountyFilter: BountyFilter;
  setMapZoom: (zoom: number) => any;
  mapZoom: number;
  setOpenPopupBountyData: (data: any) => any;
  openPopupBountyData: any;
  bountySubmissionTxnState: TxnStates;
}

// Heatmap layer style
const layerPaint = {
  'heatmap-weight': {
    property: 'priceIndicator',
    stops: [[0, 0], [5, 2]],
    type: 'exponential'
  },
  // Increase the heatmap color weight weight by zoom level
  // heatmap-ntensity is a multiplier on top of heatmap-weight
  'heatmap-intensity': {
    stops: [[0, 0], [5, 1.2]]
  },
  // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
  // Begin color ramp at 0-stop with a 0-transparancy color
  // to create a blur-like effect.
  'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(33,102,172,0)',
    0.25,
    'rgb(103,169,207)',
    0.5,
    'rgb(209,229,240)',
    0.8,
    'rgb(253,219,199)',
    1,
    'rgb(239,138,98)',
    2,
    'rgb(178,24,43)'
  ],
  // Adjust the heatmap radius by zoom level
  'heatmap-radius': {
    stops: [[0, 1], [5, 50]]
  }
};

const polygonSelectionStyles = [
  // ACTIVE (being drawn)
  // line stroke
  {
      "id": "gl-draw-line",
      "type": "line",
      "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#00bcd4",
        "line-dasharray": [0.2, 2],
        "line-width": 2
      }
  },
  // polygon fill
  {
    "id": "gl-draw-polygon-fill",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "paint": {
      "fill-color": "#00bcd4",
      "fill-outline-color": "#00bcd4",
      "fill-opacity": 0.1
    }
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    "id": "gl-draw-polygon-stroke-active",
    "type": "line",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#00bcd4",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  // vertex point halos
  {
    "id": "gl-draw-polygon-and-line-vertex-halo-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 5,
      "circle-color": "#FFF"
    }
  },
  // vertex points
  {
    "id": "gl-draw-polygon-and-line-vertex-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 3,
      "circle-color": "#00bcd4",
    }
  },

  // INACTIVE (static, already drawn)
  // line stroke
  {
      "id": "gl-draw-line-static",
      "type": "line",
      "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#000",
        "line-width": 3
      }
  },
  // polygon fill
  {
    "id": "gl-draw-polygon-fill-static",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
    "paint": {
      "fill-color": "#000",
      "fill-outline-color": "#000",
      "fill-opacity": 0.1
    }
  },
  // polygon outline
  {
    "id": "gl-draw-polygon-stroke-static",
    "type": "line",
    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#000",
      "line-width": 3
    }
  }
];

class BountyMap extends React.Component<IProps> {
  private drawControl;
  public componentDidMount() {
    const { web3, setBounties, setStakingPoolSize } = this.props;

    // Load bounties
    Web3Utils.getBounties(web3).then(setBounties).catch(err => { console.error('Unable to load bounties!'); console.error(err) });

    // Get stakingPoolSize smart-contract constant
    Web3Utils.getStakingPoolSize(web3).then(setStakingPoolSize).catch(err => { console.error('Unable to load stakingPoolSize constant!'); console.error(err) });
  }
  public componentDidUpdate = () => {
    const { bountySubmissionTxnState } = this.props;

    if (bountySubmissionTxnState === TxnStates.PENDING) {
      // Get all features
      const selectionFeatures = this.drawControl.draw.getAll().features;

      // If there are any features, remove them since the user just finished adding a new bounty
      // (the map shouldn't have any selected polygons)
      if (selectionFeatures.length > 0) {
        this.drawControl.draw.set({
          type: 'FeatureCollection',
          features: []
        });
      }
    }
  }
  public render() {
    const { center, zoom, bounties, stakingPoolSize, mapZoom, openPopupBountyData } = this.props;

    // Due to some odd behavior from the MapBox Layer component, we have to construct the array of bounty
    // feature elements beforehand and then pass the array as children to the Layer component.
    const layerFeatures: JSX.Element[] = [];
    if (mapZoom < 9) { // We only use the heatmap if we're zoomed out beyond the 9 level
      bounties.map((bounty: any, index: number) => {
        // Filter bounties by bounty filters (active/inactive/complete)
        if (this.filterBounty(bounty.balance)) {
          layerFeatures.push(<Feature
            key={index}
            coordinates={[bounty.center.latitude, bounty.center.longitude]}
          />);
        }
      });
    }

    const anyDrawnPoints = this.anyDrawnPoints();
    console.log(anyDrawnPoints);

    return (
      <div>
          <div className="row" style={{position: 'absolute', left: 0, right: 0}}>
            <div className="col-sm-9 col-md-9 col-lg-10" />
            <div className="col-sm-2 col-md-2 col-lg-1" style={{zIndex: 90}}>
              {anyDrawnPoints && 
                <button className="jr-btn jr-btn-xs btn-secondary col-sm-12 col-md-12 col-lg-12" onClick={this.polygonSelectionDone}>Done</button>
              }
              <button className="jr-btn jr-btn-xs btn-secondary col-sm-12 col-md-12 col-lg-12" onClick={this.polygonDeletionDone}>
                {anyDrawnPoints && 'Clear'}
                {(!anyDrawnPoints) && 'Start Select'}
              </button>
            </div>
            <div className="col-sm-1 col-md-1 col-lg-1" />
          </div>
          <ContributionModal />
          <div className="d-flex justify-content-center">
            <div className="row">
              <Map
                center={center}
                containerStyle={styles.map}
                style={mapStyle}
                zoom={zoom}
                onClick={this.mapClick}
                onZoom={this.onZoom}
              >
                <DrawControl
                  displayControlsDefault={false}
                  defaultMode='draw_polygon'
                  ref={(drawControl) => { this.drawControl = drawControl; }}
                  styles={polygonSelectionStyles}
                  onDrawSelectionChange={this.updatePolygonPointsInRedux}
                  onDrawDelete={this.updatePolygonPointsInRedux}
                  onDrawUpdate={this.updatePolygonPointsInRedux}
                />
                <div>
                  {(Object.keys(openPopupBountyData).length > 0) &&
                    <MapPopup />
                  }
                </div>
                <div>
                  {(mapZoom < 9) &&
                    <Layer type="heatmap" paint={layerPaint as any} children={layerFeatures} />
                  }
                </div>
                <div>
                  {(mapZoom >= 11) && bounties.map((bounty: any, index: number) => (
                    <div>
                      {(this.filterBounty(bounty.balance) && this.checkBountyStatus(bounty.balance, BountyFilter.INACTIVE)) &&
                        <Layer key={index} type="fill" paint={{'fill-color': "#00bcd4",'fill-opacity': 0.3}}>
                          <Feature
                            coordinates={[bounty.coordinates.map(item => [item.lat, item.lon])]}
                            onClick={this.markerClick.bind(this, bounty)}
                          />
                        </Layer>
                      }
                      {(this.filterBounty(bounty.balance) && this.checkBountyStatus(bounty.balance, BountyFilter.ACTIVE)) &&
                        <Layer key={index} type="fill" paint={{'fill-color': "#4caf50",'fill-opacity': 0.3}}>
                          <Feature
                            coordinates={[bounty.coordinates.map(item => [item.lat, item.lon])]}
                            onClick={this.markerClick.bind(this, bounty)}
                          />
                        </Layer>
                      }
                    </div>
                  ))}
                  {(mapZoom >= 9 && mapZoom < 11) && bounties.map((bounty: any, index: number) => {
                    // Filter bounties by bounty filters (active/inactive/complete)
                    if (this.filterBounty(bounty.balance)) {
                      return (
                        <Marker
                          key={index}
                          coordinates={[bounty.center.latitude, bounty.center.longitude]}
                          onClick={this.markerClick.bind(this, bounty)}
                        >
                            <div>
                              {(Number(bounty.balance) < Number(stakingPoolSize)) && // Show the amount staked against inactive bounties (not funded yet)
                                (bounty.balance + " NTN")}
                              {(Number(bounty.balance) >= Number(stakingPoolSize)) && // Active bounty (ready to be fulfilled)
                                <img alt="" src="https://www.mapbox.com/help/img/interactive-tools/custom_marker.png" />
                              }
                              {(Number(bounty.balance) < Number(stakingPoolSize)) && // Inactive bounty (still waiting to be fully funded)
                                <img alt="" src="https://www.mapbox.com/help/data/examples/marker-editor.svg" />
                              }
                            </div>
                        </Marker>
                      );
                    }
                    return;
                  })}
                </div>
              </Map>
            </div>
        </div>
      </div>
    )
  }
  private anyDrawnPoints = () => {
    if (!this.drawControl || !this.drawControl.draw) { return false; }

    const all = this.drawControl.draw.getAll();

    if (!all || !all.features || all.features.length === 0 ||
        !all.features[0].geometry || !all.features[0].geometry.coordinates ||
        all.features[0].geometry.coordinates.length === 0) { return false; }

    return (all.features[0].geometry.coordinates[0].length > 0);
  }
  private polygonSelectionDone = () => {
    // Get all features
    const selectionFeatures = this.drawControl.draw.getAll().features;
    // Check that there is at least one selection that contains a coordinates array
    if (!selectionFeatures || selectionFeatures.length === 0 ||
        !selectionFeatures[0].id || !selectionFeatures[0].geometry ||
        !selectionFeatures[0].geometry.coordinates || selectionFeatures[0].geometry.coordinates.length === 0) { return; }

    // Get the coordinates for the one polygon
    const pointCoordinates = selectionFeatures[0].geometry.coordinates[0];

    // Remove duplicates (duplicate coordinates are often output)
    const uniquePointsCoordinates = this.removeCoordinateDuplicates(pointCoordinates);

    // Check that there is at least three unique coordinate points
    if (!uniquePointsCoordinates || uniquePointsCoordinates.length <= 2) { return; }
    // Switch to direct selection mode (and include id of the one polygon selection)
    try {
      this.drawControl.draw.changeMode('direct_select', { featureId: selectionFeatures[0].id });
    } catch (_) {
      // Switch back to polygon draw mode since an error occured
      this.drawControl.draw.changeMode('draw_polygon');
    }
  }
  private polygonDeletionDone = () => {
    // Delete all selections
    this.drawControl.draw.deleteAll();
    // Switch to polygon draw mode
    this.drawControl.draw.changeMode('draw_polygon');
    // Update redux to reflect deletion of polygon
    this.updatePolygonPointsInRedux();
  }
  private onZoom = (map) => {
    const { setMapZoom } = this.props;

    setMapZoom(map.getZoom());
  }
  private mapClick = () => {
    const { setOpenPopupBountyData } = this.props;

    // Close popup window (due to click anywhere on map)
    setOpenPopupBountyData({});
  }
  /* 
   * When this function is called, the points making up the currently drawn polygon are
   * stored in Redux.
   */
  private updatePolygonPointsInRedux = () => {
    const { setMapPolygonPoints } = this.props;

    // Get all features
    const selectionFeatures = this.drawControl.draw.getAll().features;

    // If there is more than one feature, remove the additional ones
    // (we only want to allow the selection of one polygon on the map)
    if (selectionFeatures.length > 1) {
      this.drawControl.draw.set({
        type: 'FeatureCollection',
        features: [selectionFeatures[0]]
      });
    }

    // If no polygons exist then do nothing
    if (!selectionFeatures || selectionFeatures.length === 0 ||
        !selectionFeatures[0].geometry || !selectionFeatures[0].geometry.coordinates ||
        selectionFeatures[0].geometry.coordinates.length === 0) { return; }

    // Get the coordinates for the one polygon
    const pointCoordinates = selectionFeatures[0].geometry.coordinates[0];

    // Remove duplicates (duplicate coordinates are often output)
    const uniquePointsCoordinates = this.removeCoordinateDuplicates(pointCoordinates);

    // Save coordinates to Redux
    setMapPolygonPoints(uniquePointsCoordinates);
  }
  private removeCoordinateDuplicates(pointCoordinates) {
    // Remove duplicates (duplicate coordinates are often output)
    const uniquePointsCoordinatesSet  = new Set(pointCoordinates.map(JSON.stringify));
    return Array.from(uniquePointsCoordinatesSet).map(JSON.parse as any);
  }
  private markerClick = (bounty: any) => {
    const { setOpenPopupBountyData } = this.props;

    // Display info window
    setOpenPopupBountyData(bounty);

    /* 
     * Now we need to prevent the addition of new polygon drawn points inside of features/markers on the map.
     * Sadly, mapbox-gl-draw does not natively support any functionality for removing the most recently added
     * point from the drawn polygon; thus, we must implement this functionality below.
     */

    /* To do this, we first need to get the coordinates of the polygon that is currently being drawn */

    // Get all features
    const selectionFeatures = this.drawControl.draw.getAll().features;

    // If no polygons exist then do nothing
    if (!selectionFeatures || selectionFeatures.length === 0 ||
        !selectionFeatures[0].geometry || !selectionFeatures[0].geometry.coordinates ||
        selectionFeatures[0].geometry.coordinates.length === 0) { return; }

    // Get the coordinates for the one polygon
    const pointCoordinates = selectionFeatures[0].geometry.coordinates[0];

    // Remove duplicates (duplicate coordinates are often output)
    const uniquePointsCoordinates = this.removeCoordinateDuplicates(pointCoordinates);

    // Get the newest added coordinate (last one)
    let newlyAddedCoordinate = uniquePointsCoordinates[uniquePointsCoordinates.length - 1];
    newlyAddedCoordinate = {
      latitude: newlyAddedCoordinate[0],
      longitude: newlyAddedCoordinate[1]
    };

    /* Now, get the coordinates of the newly added point to the polygon being drawn (last coordinate is the newest) */

    // Get the coordinates of the bounty (features/marker) that has been clicked
    const clickBountyCoordinates = bounty.coordinates.map(elem => ({latitude: elem.lat, longitude: elem.lon}));

    /* Finally, check if the newly added coordinate is contained within the clicked features/marker */
    if (geolib.isPointInside(newlyAddedCoordinate, clickBountyCoordinates)) {
      // Since the newly added drawn polygon point is inside existing features/marker we need to prevent/remove it
      const pointToRemove = uniquePointsCoordinates[uniquePointsCoordinates.length - 1]; // Element to be removed

      // Create a new array excluding the newly added point (pointToRemove)
      const updatedUniqueCoordinates = uniquePointsCoordinates.filter(elem => (elem[0] !== pointToRemove[0] || elem[1] !== pointToRemove[1]));
      
      let line;
      let polygonArr;
      // We only bother updating the polygon (to exclude the newly added point) if it will now have at least
      // three points, since MapBox draw doesn't allow a polygon to be set with less than three (obviously
      // since that would be a line)
      if (updatedUniqueCoordinates.length >= 3) {
        // Create line (for generating a polygon using turfjs)
        line = turf.lineString(updatedUniqueCoordinates);
        // Generate the polygon from the line
        polygonArr = [turf.lineToPolygon(line)];
      } else {
        // Empty polygon since we don't have enough points for a polygon (less than three)
        polygonArr = [];
      }

      // Update the drawn polygon on the map (to now exclude the new point)
      this.drawControl.draw.set({
        type: 'FeatureCollection',
        features: polygonArr
      });

      // Update redux to reflect this change in the drawn polygon (since mapbox-gl-draw events don't fire
      // after programatic changes to the drawn polygon).
      this.updatePolygonPointsInRedux();
    }
  }
  /*
   * This function is used to filter bounties on the map based on the filter selected by the user
   */
  private filterBounty = (bountyBalance: number): boolean => {
    const { bountyFilter, stakingPoolSize } = this.props;

    switch (String(bountyFilter)) {
      case String(BountyFilter.INACTIVE):
        return (Number(bountyBalance) < Number(stakingPoolSize));
      case String(BountyFilter.ACTIVE):
        return (Number(bountyBalance) >= Number(stakingPoolSize));
      default:
        return true; // By default (including ALL case), we show all bounties on the map
    }
  }
  /*
   * This function is used to check if a bounty agrees with a particular status
   */
  private checkBountyStatus = (bountyBalance: number, statusType: BountyFilter): boolean => {
    const { stakingPoolSize } = this.props;

    switch (String(statusType)) {
      case String(BountyFilter.INACTIVE):
        return (Number(bountyBalance) < Number(stakingPoolSize));
      case String(BountyFilter.ACTIVE):
        return (Number(bountyBalance) >= Number(stakingPoolSize));
      default:
        return true; // By default (including ALL case)
    }
  }
}

export default compose<any>(
  connect(
    state => ({
      bounties: state.tcro.bounties,
      center: state.map.center,
      stakingPoolSize: state.tcro.stakingPoolSize,
      bountyFilter: state.map.bountyFilter,
      mapZoom: state.map.mapZoom,
      openPopupBountyData: state.map.openPopupBountyData,
      bountySubmissionTxnState: state.map.bountySubmissionTxnState
    }),
    dispatch => ({
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setMapPolygonPoints: bindActionCreators(mapActions.setMapPolygonPoints, dispatch),
      setStakingPoolSize: bindActionCreators(tcroActions.setStakingPoolSize, dispatch),
      setMapZoom: bindActionCreators(mapActions.setMapZoom, dispatch),
      setOpenPopupBountyData: bindActionCreators(mapActions.setOpenPopupBountyData, dispatch)
    })
  ),
  withWeb3
)(BountyMap);
