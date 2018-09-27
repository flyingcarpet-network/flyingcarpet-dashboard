import * as React from 'react';
import { Popup } from 'react-mapbox-gl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mapActions from '../../actions/mapActions';
import * as modalsActions from '../../actions/modalsActions';
import './MapPopup.css';

export interface IProps {
  toggleStakingDialog: () => any;
  setSelectedBountyToStake: (bountyID: number) => any;
  stakingPoolSize: number;
  setOpenPopupBountyData: (data: any) => any;
  openPopupBountyData: any;
}

class MapPopup extends React.Component<IProps> {
  public render() {
    const { stakingPoolSize, openPopupBountyData } = this.props;

    return (
      <Popup
        coordinates={[openPopupBountyData.center.latitude, openPopupBountyData.center.longitude]}
        className="card"
        style={{backgroundColor: 'rgba(0,0,0,0)!important', color: 'black', maxWidth: 400, wordWrap: 'break-word'}}
      >
        <div className="card-header" style={{whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis'}}>{openPopupBountyData.title}</div>
        <div className="card-body">
          <div><p>{openPopupBountyData.description}</p></div>
          <div><b>Status:</b> {(Number(openPopupBountyData.balance) < Number(stakingPoolSize)) ? 'Inactive' : 'Active'}</div>
          <div><b>Funding:</b> {openPopupBountyData.balance} / {stakingPoolSize} NTN</div>
          <div><b>Bounty ID:</b> {openPopupBountyData.bountyID}</div>
          <div><b>Center Coordinate:</b> {openPopupBountyData.center.latitude}, {openPopupBountyData.center.longitude}</div>
          <div className="form-group"><b>All Vertex Coordinates:</b> {openPopupBountyData.coordinates.map(coord => ("(" + coord.lat + ", " + coord.lon + ")")).join(', ')}</div>
          {(Number(openPopupBountyData.balance) < Number(stakingPoolSize)) &&
            <button onClick={this.openStakingDialog} className="jr-btn jr-btn-secondary text-uppercase btn-block btn btn-default">
              Stake NTN to Support Bounty
            </button>
          }
        </div>
      </Popup>
    );
  }
  private openStakingDialog = () => {
    const { toggleStakingDialog, setSelectedBountyToStake, stakingPoolSize, setOpenPopupBountyData, openPopupBountyData } = this.props;

    // Only allow staking dialog to be opened if clicked an inactive (unfunded bounty)
    if (Number(openPopupBountyData.balance) < Number(stakingPoolSize)) {
      toggleStakingDialog(); // Open staking modal
      setSelectedBountyToStake(openPopupBountyData.bountyID); // Set bounty ID of currently clicked bounty
    }

    // Close info window
    setOpenPopupBountyData({});
  }
}

export default connect(
  state => ({
    stakingPoolSize: state.tcro.stakingPoolSize,
    openPopupBountyData: state.map.openPopupBountyData
  }),
  dispatch => ({
    toggleStakingDialog: bindActionCreators(modalsActions.toggleStakingDialog, dispatch),
    setSelectedBountyToStake: bindActionCreators(mapActions.setSelectedBountyToStake, dispatch),
    setOpenPopupBountyData: bindActionCreators(mapActions.setOpenPopupBountyData, dispatch)
  })
)(MapPopup);
