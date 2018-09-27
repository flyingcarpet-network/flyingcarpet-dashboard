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
  mapSelectedPolygonPoints: any;
  formData: any;
  setGeohashes: (newGeohash: string) => any;
  setBountySubmissionTxnState: (state: TxnStates) => any;
  bountySubmissionTxnState: TxnStates;
  setCoordinates: (newCoordinates: string) => any;
  setBounties: (bounties: any) => any;
  lastSuccessfulBountyTxnHash: string;
  setLastSuccessfulBountyTxnHash: (hash: string) => any;
}

class BountyCreationPanel extends React.Component<IProps> {
  public componentDidUpdate() {
    const { formData, setGeohashes, setCoordinates } = this.props;

    let geohashesInputValue = '';
    // Only access current geohash if it is in fact set (not undefined)
    if (formData && formData.values && formData.values.geohashes) {
      geohashesInputValue = formData.values.geohashes;
    }

    // Get new updated geohash
    this.getGeohashes().then(geohashes => {
      const newGeohashes = Array(geohashes).join(', ');
      // Compare new updated geohash to existing one, and if they're not different,
      // then do nothing
      if (newGeohashes === geohashesInputValue) { return; }
      // If they are different, update the input to contain the new geohash
      setGeohashes(newGeohashes);
      // Also update the coordiates input
      this.getCoordinatesString().then((coordinateStringsArray: string[]) => {
        setCoordinates(coordinateStringsArray.join(', '));
      });
    });
  }

  public render() {
    const { bountySubmissionTxnState, lastSuccessfulBountyTxnHash } = this.props;

    return (
        <div className="col-sm-6 col-md-4 col-lg-3 col-12" style={{zIndex: 90}}>
          {(bountySubmissionTxnState === TxnStates.DEFAULT) &&
            <Form onSubmit={this.formSubmit} />
          }
          {(bountySubmissionTxnState === TxnStates.PENDING) &&
            <div className="jr-card ">
              <div className="jr-card-header">
                <h3 className="card-heading">
                  <span>Bounty submission successfully</span>
                </h3>
              </div>
              <div className="jr-card-body d-flex justify-content-center">
                <div>
                  <span>See the transaction pending here: <a href={"https://rinkeby.etherscan.io/tx/" + lastSuccessfulBountyTxnHash} target="_blank">EtherScan</a></span>
                  <span className="icon-btn" id="tooltip-add">
                    <i className="zmdi zmdi-mood"/>
                  </span>
                </div>
              </div>
            </div>
          }
          {(bountySubmissionTxnState === TxnStates.SUBMITTED) &&
            <div className="jr-card ">
              <div className="jr-card-header">
                <h3 className="card-heading">
                  <span>Submission transaction processing.</span>
                </h3>
              </div>
              <div className="jr-card-body d-flex justify-content-center">
                <div>
                  Please wait... (May take as long as 15 seconds to be added to a block)
                  <span className="icon-btn" id="tooltip-add">
                    <i className="zmdi zmdi-alert-triangle"/>
                  </span>
                </div>
              </div>
            </div>
          }
          {(bountySubmissionTxnState === TxnStates.FAILED) &&
            <div className="jr-card ">
              <div className="jr-card-header">
                <h3 className="card-heading">
                  <span>Bounty submission failed.</span>
                </h3>
              </div>
              <div className="jr-card-body d-flex justify-content-center">
                <div>
                  Please check that you have enough ETH for gas.
                  <span className="icon-btn" id="tooltip-add">
                    <i className="zmdi zmdi-mood-bad"/>
                  </span>
                </div>
              </div>
            </div>
          }
      </div>
    );
  }
  private getGeohashes = () => {
    return new Promise(resolve => {
      const { mapSelectedPolygonPoints } = this.props;

      const geohashes: any[] = [];

      if (!mapSelectedPolygonPoints || mapSelectedPolygonPoints.length === 0) {
        return resolve(geohashes);
      }

      return mapSelectedPolygonPoints.forEach((item: number[], index) => {
        geohashes.push(this.getGeohash(item as number[]) as string);
        if (index === mapSelectedPolygonPoints.length - 1) {
          return resolve(geohashes);
        }
      });
    });
  }
  private getGeohash(coordinatePair): string {
    if (!coordinatePair || coordinatePair.length !== 2) { return ''; }
    return Geohash.encode(coordinatePair[0], coordinatePair[1]);
  }
  private getCoordinatesString = () => {
    return new Promise(resolve => {
      const { mapSelectedPolygonPoints } = this.props;

      const coordinateStringsArray: any[] = [];

      if (!mapSelectedPolygonPoints || mapSelectedPolygonPoints.length === 0) {
        return resolve(coordinateStringsArray);
      }

      return mapSelectedPolygonPoints.forEach((item: number[], index) => {
        if (item && item.length === 2) {
          coordinateStringsArray.push('(' + item[0] + ', ' + item[1] + ')');
        }
        if (index === mapSelectedPolygonPoints.length - 1) {
          return resolve(coordinateStringsArray);
        }
      });
    });
  }
  private formSubmit = values => {
    const { web3, setBountySubmissionTxnState, setBounties, setLastSuccessfulBountyTxnHash } = this.props;

    // Validate that a geohash string is being submitted, otherwise provide an error to the user
    if (!values.geohashes || values.geohashes.length === 0) {
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
      mapSelectedPolygonPoints: state.map.mapSelectedPolygonPoints,
      formData: state.form.bountyCreationPanel,
      bountySubmissionTxnState: state.map.bountySubmissionTxnState,
      lastSuccessfulBountyTxnHash: state.map.lastSuccessfulBountyTxnHash
    }),
    dispatch => ({
      setBountySubmissionTxnState: bindActionCreators(mapActions.setBountySubmissionTxnState, dispatch),
      // Dispatches redux-form action
      setGeohashes: (newGeohash: string) => dispatch(change('bountyCreationPanel', 'geohashes', newGeohash)),
      setCoordinates: (newCoordinates: string) => dispatch(change('bountyCreationPanel', 'coordinates', newCoordinates)),
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setLastSuccessfulBountyTxnHash: bindActionCreators(mapActions.setLastSuccessfulBountyTxnHash, dispatch)
    })
  ),
  withWeb3
)(BountyCreationPanel);
