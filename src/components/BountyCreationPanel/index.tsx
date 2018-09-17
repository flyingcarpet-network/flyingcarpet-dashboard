import Geohash from 'latlon-geohash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
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
  setBounties: (bounties: any) => any;
}

class BountyCreationPanel extends React.Component<IProps> {
  public componentDidUpdate() {
    const { formData, setGeohash } = this.props;

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
    }
  }
  public render() {
    const { bountySubmittedSuccessfully } = this.props;

    return (
      <div>
          {(!bountySubmittedSuccessfully) &&
            <Form onSubmit={this.formSubmit} />
          }
          {bountySubmittedSuccessfully &&
            <div>Bounty successfully submitted to the TCRO!</div>
          }
      </div>
    );
  }
  private getGeohash = () => {
    const { mapClickLocation } = this.props;

    if (!mapClickLocation.lat || !mapClickLocation.lng) { return ''; }
    return Geohash.encode(mapClickLocation.lat, mapClickLocation.lng);
  }
  private formSubmit = values => {
    const { web3, toggleBountySubmissionSuccessfully, setBounties } = this.props;

    // TODO: Save/return the resulting transaction hash from successful transactions
    return Web3Utils.submitBounty(web3, values).then(() => {
      // Show sucess message
      toggleBountySubmissionSuccessfully();
      // Switch back to creation dialog in 10 seconds
      setTimeout(toggleBountySubmissionSuccessfully, 10000);
      // Reload map bounties
      Web3Utils.getBounties(web3).then(setBounties).catch(err => { console.error('Unable to load bounties!'); console.error(err); });
    }).catch(console.error);
  }
}

export default compose<any>(
  connect(
    state => ({
      mapClickLocation: state.map.mapClickLocation,
      formData: state.form.bountyCreationPanel,
      bountySubmittedSuccessfully: state.map.bountySubmittedSuccessfully
    }),
    dispatch => ({
      toggleBountySubmissionSuccessfully: bindActionCreators(mapActions.toggleBountySubmissionSuccessfully, dispatch),
      // Dispatches redux-form action
      setGeohash: (newGeohash: string) => dispatch(change('bountyCreationPanel', 'geohash', newGeohash)),
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch)
    })
  ),
  withWeb3
)(BountyCreationPanel);
