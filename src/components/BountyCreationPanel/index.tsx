import Geohash from 'latlon-geohash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import { change, SubmissionError } from 'redux-form';
import * as mapActions from '../../actions/mapActions';
import * as tcroActions from '../../actions/tcroActions';
import * as Web3Utils from '../../utils/web3-utils';
import Form from './Form';

export interface IProps {
  web3: any;
  handleSubmit: () => any;
  mapClickLocation: {lat: number, lng: number};
  formData: any;
  setGeohash: (newGeohash: string) => any;
  toggleBountySubmissionSuccessfully: () => any;
  bountySubmittedSuccessfully: boolean;
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
    const { bountySubmittedSuccessfully, lastSuccessfulBountyTxnHash } = this.props;

    return (
      <div className="col-sm-6 col-md-4 col-lg-3 col-12" style={{zIndex: 90}}>
          {(!bountySubmittedSuccessfully) &&
            <Form onSubmit={this.formSubmit} />
          }
          {bountySubmittedSuccessfully &&
            <div>Bounty successfully submitted to the TCRO!<br />You can view the transaction on <a href={"https://rinkeby.etherscan.io/tx/" + lastSuccessfulBountyTxnHash} target="_blank">EtherScan</a>.</div>
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
    const { web3, toggleBountySubmissionSuccessfully, setBounties, setLastSuccessfulBountyTxnHash } = this.props;

    // Validate that a geohash string is being submitted, otherwise provide an error to the user
    if (!values.geohash || values.geohash.length === 0) {
      throw new SubmissionError({ _error: 'Please select a location for your bounty on the map.' });
      return;
    }

    // Validate that a geohash string is being submitted, otherwise provide an error to the user
    if (!values.geohash || values.geohash.length === 0) {
      throw new SubmissionError({ _error: 'Please select a location for your bounty on the map.' });
      return;
    }

    // TODO: Save/return the resulting transaction hash from successful transactions
    return Web3Utils.submitBounty(web3, values).then(res => {
      // Show sucess message
      toggleBountySubmissionSuccessfully();
      // Switch back to creation dialog in 10 seconds
      setTimeout(toggleBountySubmissionSuccessfully, 10000);
      // Reload map bounties
      Web3Utils.getBounties(web3).then(setBounties).catch(err => { console.error('Unable to load bounties!'); console.error(err); });
      // Set hash of successful bounty
      setLastSuccessfulBountyTxnHash((res as any).transactionHash);
    }).catch(console.error);
  }
}

export default compose<any>(
  connect(
    state => ({
      mapClickLocation: state.map.mapClickLocation,
      formData: state.form.bountyCreationPanel,
      bountySubmittedSuccessfully: state.map.bountySubmittedSuccessfully,
      lastSuccessfulBountyTxnHash: state.map.lastSuccessfulBountyTxnHash
    }),
    dispatch => ({
      toggleBountySubmissionSuccessfully: bindActionCreators(mapActions.toggleBountySubmissionSuccessfully, dispatch),
      // Dispatches redux-form action
      setGeohash: (newGeohash: string) => dispatch(change('bountyCreationPanel', 'geohash', newGeohash)),
      setCoordinates: (newCoordinates: string) => dispatch(change('bountyCreationPanel', 'coordinates', newCoordinates)),
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setLastSuccessfulBountyTxnHash: bindActionCreators(mapActions.setLastSuccessfulBountyTxnHash, dispatch)
    })
  ),
  withWeb3
)(BountyCreationPanel);
