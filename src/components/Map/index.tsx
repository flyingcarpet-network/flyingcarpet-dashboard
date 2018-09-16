import * as React from 'react';
import ReactMapboxGl, { Feature, Layer, Marker } from 'react-mapbox-gl';
import { MapEvent } from 'react-mapbox-gl/lib/map-events';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import * as mapActions from '../../actions/mapActions';
import * as modalsActions from '../../actions/modalsActions';
import * as tcroActions from '../../actions/tcroActions';
import { MAPBOX_ACCESS_TOKEN } from '../../constants';
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
  mapInit?: MapEvent;
  zoom?: [number];
  web3: any;
  bounties: [any];
  setBounties: () => any;
  setMapClickLocation: (location: [any,any]) => any;
  toggleStakingDialog: () => any;
  setSelectedBountyToStake: (bountyID: number) => any;
}

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

class BountyMap extends React.Component<IProps> {
  public componentDidMount() {
    const { web3, setBounties } = this.props;
    Web3Utils.getBounties(web3).then(setBounties).catch(() => console.error('Unable to load bounties!'));
  }
  public render() {
    const { center, mapInit, zoom, bounties } = this.props;

    return (
      <div className="app-wrapper">
          <ContributionModal />
          <div className="d-flex justify-content-center">
            <div className="row">
              <Map
                center={center}
                containerStyle={styles.map}
                onStyleLoad={mapInit}
                style={mapStyle}
                zoom={zoom}
                onClick={this.recordMapClick}
              >
                <Layer type="heatmap" paint={layerPaint as any}>
                  {bounties.map((bounty: any, index: number) => (
                    <Feature
                      key={index}
                      coordinates={[bounty.coordinates.lon, bounty.coordinates.lat]}
                    />
                  ))}
                </Layer>
                <div>
                  {bounties.map((bounty: any, index: number) => (
                    <Marker
                      key={index}
                      coordinates={[bounty.coordinates.lon, bounty.coordinates.lat]}
                      onClick={this.markerClick.bind(this, bounty.bountyID)}
                    >
                      <img alt="" src="https://www.mapbox.com/help/img/interactive-tools/custom_marker.png" />
                    </Marker>
                  ))}
                </div>
              </Map>
            </div>
        </div>
      </div>
    )
  }
  private recordMapClick = (_, data) => {
    const { setMapClickLocation } = this.props;

    setMapClickLocation(data.lngLat);
  }
  private markerClick = (bountyID: number) => {
    const { toggleStakingDialog, setSelectedBountyToStake } = this.props;

    toggleStakingDialog(); // Open staking modal
    setSelectedBountyToStake(bountyID); // Set bounty ID of currently clicked bounty
  }
}

export default compose<any>(
  connect(
    state => ({
      bounties: state.tcro.bounties,
      center: state.map.center
    }),
    dispatch => ({
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setMapClickLocation: bindActionCreators(mapActions.setMapClickLocation, dispatch),
      toggleStakingDialog: bindActionCreators(modalsActions.toggleStakingDialog, dispatch),
      setSelectedBountyToStake: bindActionCreators(mapActions.setSelectedBountyToStake, dispatch)
    })
  ),
  withWeb3
)(BountyMap);
