import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as React from 'react';
import ReactMapboxGl, { Feature, Layer, Marker } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import * as mapActions from '../../actions/mapActions';
import * as modalsActions from '../../actions/modalsActions';
import * as tcroActions from '../../actions/tcroActions';
import { MAPBOX_ACCESS_TOKEN } from '../../constants';
import { BountyFilter } from '../../reducers/dataTypeEnums';
import * as Web3Utils from '../../utils/web3-utils';
import ContributionModal from './../ContributionModal';

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
  toggleStakingDialog: () => any;
  setSelectedBountyToStake: (bountyID: number) => any;
  setStakingPoolSize: (size: number) => any;
  stakingPoolSize: number;
  bountyFilter: BountyFilter;
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
        "line-color": "#D20C0C",
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
      "fill-color": "#D20C0C",
      "fill-outline-color": "#D20C0C",
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
      "line-color": "#D20C0C",
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
      "circle-color": "#D20C0C",
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
  public render() {
    const { center, zoom, bounties, stakingPoolSize } = this.props;

    // Due to some odd behavior from the MapBox Layer component, we have to construct the array of bounty
    // feature elements beforehand and then pass the array as children to the Layer component.
    const layerFeatures: JSX.Element[] = [];
    bounties.map((bounty: any, index: number) => {
      // Filter bounties by bounty filters (active/inactive/complete)
      if (this.filterBounty(bounty.balance)) {
        layerFeatures.push(<Feature
          key={index}
          coordinates={[bounty.center.latitude, bounty.center.longitude]}
        />);
      }
    })

    return (
      <div>
          <ContributionModal />
          <div className="d-flex justify-content-center">
            <div className="row">
              <Map
                center={center}
                containerStyle={styles.map}
                style={mapStyle}
                zoom={zoom}
                onClick={this.recordMapClick}
              >
                <DrawControl
                  position='bottom-right'
                  controls={{point: false, line_string: false, polygon: true, trash: true, combine_features: false, uncombine_features: false}}
                  defaultMode='draw_polygon'
                  ref={(drawControl) => { this.drawControl = drawControl; }}
                  styles={polygonSelectionStyles}
                />
                <Layer type="heatmap" paint={layerPaint as any} children={layerFeatures} />
                <div>
                  {bounties.map((bounty: any, index: number) => {
                    // Filter bounties by bounty filters (active/inactive/complete)
                    if (this.filterBounty(bounty.balance)) {
                      return (
                        <Layer key={index} type="fill" paint={{'fill-color': "#ff0000",'fill-opacity': 0.3}}>
                          <Feature
                            coordinates={[bounty.coordinates.map(item => [item.lat, item.lon])]}
                            onClick={this.markerClick.bind(this, bounty)}
                          />
                        </Layer>
                      );
                    }
                    return;
                  })}
                  {bounties.map((bounty: any, index: number) => {
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
                              {(bounty.balance < stakingPoolSize) && // Inactive bounty (still waiting to be fully funded)
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
  private recordMapClick = (_, data) => {
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
    const uniquePointsCoordinatesSet  = new Set(pointCoordinates.map(JSON.stringify));
    const uniquePointsCoordinates = Array.from(uniquePointsCoordinatesSet).map(JSON.parse as any);

    // Save coordinates to Redux
    setMapPolygonPoints(uniquePointsCoordinates);
  }
  private markerClick = (bounty: any) => {
    const { toggleStakingDialog, setSelectedBountyToStake, stakingPoolSize } = this.props;

    // Only allow staking dialog to be opened if clicked an inactive (unfunded bounty)
    if (Number(bounty.balance) < Number(stakingPoolSize)) {
      toggleStakingDialog(); // Open staking modal
      setSelectedBountyToStake(bounty.bountyID); // Set bounty ID of currently clicked bounty
    }
  }
  /*
   * This function is used to filter bounties on the map based on the filter selected by the user
   */
  private filterBounty = (bountyBalance: number): boolean => {
    const { bountyFilter, stakingPoolSize } = this.props;

    switch (String(bountyFilter)) {
      case String(BountyFilter.INACTIVE):
        return (bountyBalance < stakingPoolSize);
      case String(BountyFilter.ACTIVE):
        return (bountyBalance >= stakingPoolSize);
      default:
        return true; // By default (including ALL case), we show all bounties on the map
    }
  }
}

export default compose<any>(
  connect(
    state => ({
      bounties: state.tcro.bounties,
      center: state.map.center,
      stakingPoolSize: state.tcro.stakingPoolSize,
      bountyFilter: state.map.bountyFilter
    }),
    dispatch => ({
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setMapPolygonPoints: bindActionCreators(mapActions.setMapPolygonPoints, dispatch),
      toggleStakingDialog: bindActionCreators(modalsActions.toggleStakingDialog, dispatch),
      setSelectedBountyToStake: bindActionCreators(mapActions.setSelectedBountyToStake, dispatch),
      setStakingPoolSize: bindActionCreators(tcroActions.setStakingPoolSize, dispatch)
    })
  ),
  withWeb3
)(BountyMap);
