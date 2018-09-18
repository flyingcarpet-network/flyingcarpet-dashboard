import Geohash from 'latlon-geohash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import { change, SubmissionError } from 'redux-form';
import * as mapActions from '../../actions/mapActions';
import * as tcroActions from '../../actions/tcroActions';
import { TxnStates } from '../../reducers/dataTypeEnums';
import * as Web3Utils from '../../utils/web3-utils';
import Form from './Form';

export interface IProps {
  web3: any;
  handleSubmit: () => any;
  mapClickLocation: {lat: number, lng: number};
  formData: any;
  setGeohash: (newGeohash: string) => any;
  setBountySubmissionTxnState: (state: TxnStates) => any;
  bountySubmissionTxnState: TxnStates;
  setCoordinates: (newCoordinates: string) => any;
  setBounties: (bounties: any) => any;
  lastSuccessfulBountyTxnHash: string;
  setLastSuccessfulBountyTxnHash: (hash: string) => any;
}

class BountyCreationPanel extends React.Component<IProps> {
  public componentDidUpdate() {
    const { formData, setGeohash, setCoordinates } = this.props;

    let geohashInputValue = '';
    // Only access current geohash if it is in fact set (not undefined)
    if (formData && formData.values && formData.values.geohash) {
      geohashInputValue = formData.values.geohash;
    }

    // Get new updated geohash
    const newGeohash = this.getGeohash();

    // Compare new updated geohash to existing one, and if they're different,
    // update the input to contain the new geohash
    if (newGeohash !== geohashInputValue) {
      setGeohash(newGeohash);
      setCoordinates(this.getCoordinatesString(newGeohash));
    }
  }
  public render() {
    const { bountySubmissionTxnState, lastSuccessfulBountyTxnHash } = this.props;

    return (
      <div>
          {(bountySubmissionTxnState === TxnStates.DEFAULT) &&
            <Form onSubmit={this.formSubmit} />
          }
          {(bountySubmissionTxnState === TxnStates.PENDING) &&
            <div>Bounty submission successfully added to block!<br />See the transaction pending here: <a href={"https://rinkeby.etherscan.io/tx/" + lastSuccessfulBountyTxnHash} target="_blank">EtherScan</a>.</div>
          }
          {(bountySubmissionTxnState === TxnStates.SUBMITTED) &&
            <div>Submission transaction processing... Please wait... (May take as long as 15 seconds to be added to a block)</div>
          }
          {(bountySubmissionTxnState === TxnStates.FAILED) &&
            <div>Bounty submission failed. Please check that you have enough ETH for gas.</div>
          }
      </div>
    );
  }
  private getGeohash = () => {
    const { mapClickLocation } = this.props;

    if (!mapClickLocation.lat || !mapClickLocation.lng) { return ''; }
    return Geohash.encode(mapClickLocation.lat, mapClickLocation.lng);
  }
  private getCoordinatesString(geohash) {
    const coordinatesObj = Geohash.decode(geohash);
    return coordinatesObj.lat + ", " + coordinatesObj.lon;
  }
  private formSubmit = values => {
    const { web3, setBountySubmissionTxnState, setBounties, setLastSuccessfulBountyTxnHash } = this.props;

    // Validate that a geohash string is being submitted, otherwise provide an error to the user
    if (!values.geohash || values.geohash.length === 0) {
      throw new SubmissionError({ _error: 'Please select a location for your bounty on the map.' });
      return;
    }

    // Show transaction processing
    setBountySubmissionTxnState(TxnStates.SUBMITTED);
    // Submit bounty via Web3
    return Web3Utils.submitBounty(web3, values).then(res => {
      // Show sucess message
      setBountySubmissionTxnState(TxnStates.PENDING);
      // Switch back to creation dialog in 10 seconds
      setTimeout(() => setBountySubmissionTxnState(TxnStates.DEFAULT), 10000);
      // Reload map bounties
      Web3Utils.getBounties(web3).then(setBounties).catch(err => { console.error('Unable to load bounties!'); console.error(err); });
      // Set hash of successful bounty
      setLastSuccessfulBountyTxnHash((res as any).transactionHash);
    }).catch(err => {
      // Print error to console
      console.error(err);
      // Show failed text
      setBountySubmissionTxnState(TxnStates.FAILED);
      // Switch back to creation dialog in 10 seconds
      setTimeout(() => setBountySubmissionTxnState(TxnStates.DEFAULT), 10000);
    });
  }
}

export default compose<any>(
  connect(
    state => ({
      mapClickLocation: state.map.mapClickLocation,
      formData: state.form.bountyCreationPanel,
      bountySubmissionTxnState: state.map.bountySubmissionTxnState,
      lastSuccessfulBountyTxnHash: state.map.lastSuccessfulBountyTxnHash
    }),
    dispatch => ({
      setBountySubmissionTxnState: bindActionCreators(mapActions.setBountySubmissionTxnState, dispatch),
      // Dispatches redux-form action
      setGeohash: (newGeohash: string) => dispatch(change('bountyCreationPanel', 'geohash', newGeohash)),
      setCoordinates: (newCoordinates: string) => dispatch(change('bountyCreationPanel', 'coordinates', newCoordinates)),
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setLastSuccessfulBountyTxnHash: bindActionCreators(mapActions.setLastSuccessfulBountyTxnHash, dispatch)
    })
  ),
  withWeb3
)(BountyCreationPanel);
