import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { bindActionCreators, compose } from 'redux';
import * as mapActions from '../../actions/mapActions';
import * as modalsActions from '../../actions/modalsActions';
import * as tcroActions from '../../actions/tcroActions';
import { TxnStates } from '../../reducers/dataTypeEnums';
import * as Web3Utils from '../../utils/web3-utils';

export interface IProps {
  showStakingDialog: boolean;
  toggleStakingDialog: () => any;
  bountyStakeAmount: number;
  setBountyStakeAmount: (stakeAmount: number) => any;
  web3: any;
  selectedBountyToStake: number;
  setBountyStakingTxnState: (state: TxnStates) => any;
  bountyStakingTxnState: TxnStates;
  setBounties: (bounties: any) => any;
  lastSuccessfulBountyTxnHash: string;
  setLastSuccessfulBountyTxnHash: (hash: string) => any;
}

class AlertModals extends React.Component<IProps> {
  public render() {
    const { showStakingDialog, toggleStakingDialog, bountyStakeAmount, bountyStakingTxnState, lastSuccessfulBountyTxnHash } = this.props;

    return (
      <div className="text-center">
        <a onClick={toggleStakingDialog}>Staking dialog</a>
        <Modal
          isOpen={showStakingDialog}
          toggle={toggleStakingDialog}>
          <ModalHeader>Stake This Opportunity</ModalHeader>
          {(bountyStakingTxnState === TxnStates.DEFAULT) &&
            <ModalBody>
            <div className="jr-card-header"><div className="sub-heading">Nitrogen to stake:</div></div>
              <div className="form-row">
                <div className="col">
                  <input type="text"
                    className="form-control"
                    onChange={this.onChange}
                    value={bountyStakeAmount}/></div>
                <button className="jr-btn jr-flat-btn jr-btn-primary jr-btn-sm btn btn-default">NTN</button>
              </div>
              Please enter the amount of Nitrogen you would like to stake in support of the selected data collection opportunity,
              then press the "done" button below. You will then be prompted with two different MetaMask transactions popups.
            </ModalBody>
          }
          {(bountyStakingTxnState === TxnStates.PENDING) &&
            <ModalBody>
              <b>Bounty staking transaction successfully added to block!</b>
              <br />
              See the transaction pending here: <a href={"https://rinkeby.etherscan.io/tx/" + lastSuccessfulBountyTxnHash} target="_blank">EtherScan</a>.
            </ModalBody>
          }
          {(bountyStakingTxnState === TxnStates.SUBMITTED) &&
            <ModalBody>
              <b>Staking transaction processing... Please confirm both transactions</b>
              <br />
              Please wait... (May take as long as 30 seconds for both transactions to be added to blocks)
            </ModalBody>
          }
          {(bountyStakingTxnState === TxnStates.FAILED) &&
            <ModalBody>
              <b>Bounty staking failed.</b>
              <br />
              Please check that you have NTN to stake and enough ETH for gas.
            </ModalBody>
          }

          <ModalFooter>
            <div className="jr-btn-group">
              {(bountyStakingTxnState === TxnStates.DEFAULT) &&
                <Button
                  className="jr-btn btn-primary btn btn-success"
                  onClick={this.contributeToBounty}
                >
                  Done
                </Button>
              }
              {(bountyStakingTxnState === TxnStates.DEFAULT) && ' '}
              <Button className="jr-btn btn-primary btn btn-default"
                onClick={toggleStakingDialog}
              >
                Cancel
              </Button>
              {' '}
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  private onChange = (event) => {
    const { setBountyStakeAmount } = this.props;

    const bountyStakeAmount = event.target.value;
    setBountyStakeAmount(bountyStakeAmount);
  }
  private contributeToBounty = () => {
    const { web3, selectedBountyToStake, bountyStakeAmount, toggleStakingDialog, setBountyStakeAmount, setBountyStakingTxnState, setBounties, setLastSuccessfulBountyTxnHash } = this.props;

    // Only allow contribution submission if the bountyStakeAmount is a positive number
    if (isNaN(bountyStakeAmount) || bountyStakeAmount <= 0) { return; }
    // Show transaction submitted message
    setBountyStakingTxnState(TxnStates.SUBMITTED);
    // Contribute via Web3
    Web3Utils.contributeToBounty(web3, selectedBountyToStake, bountyStakeAmount).then(res => {
      // Clear bounty staking input
      setBountyStakeAmount(0);
      // Show success message
      setBountyStakingTxnState(TxnStates.PENDING);
      // Set hash of successful bounty
      setLastSuccessfulBountyTxnHash((res as any).transactionHash);
      // Wait 6 seconds
      setTimeout(() => {
        // Close the staking dialog modal
        toggleStakingDialog();
        // Hide success message
        setBountyStakingTxnState(TxnStates.DEFAULT);
        // Reload map bounties
        Web3Utils.getBounties(web3).then(setBounties).catch(err => { console.error('Unable to load bounties!'); console.error(err); });
      }, 10000);
    }).catch(err => {
      // Print error to console
      console.error(err);
      // Show message of failed transaction
      setBountyStakingTxnState(TxnStates.FAILED);
      // Hide failure message
      setTimeout(() => { setBountyStakingTxnState(TxnStates.DEFAULT); }, 10000);
    });
  }
}

export default compose<any>(
  connect(
    state => ({
      showStakingDialog: state.modals.stakingDialog,
      bountyStakeAmount: state.map.bountyStakeAmount,
      selectedBountyToStake: state.map.selectedBountyToStake,
      bountyStakingTxnState: state.map.bountyStakingTxnState,
      lastSuccessfulBountyTxnHash: state.map.lastSuccessfulBountyTxnHash
    }),
    dispatch => ({
      toggleStakingDialog: bindActionCreators(modalsActions.toggleStakingDialog, dispatch),
      setBountyStakeAmount: bindActionCreators(mapActions.setBountyStakeAmount, dispatch),
      setBountyStakingTxnState: bindActionCreators(mapActions.setBountyStakingTxnState, dispatch),
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setLastSuccessfulBountyTxnHash: bindActionCreators(mapActions.setLastSuccessfulBountyTxnHash, dispatch)
    })
  ),
  withWeb3
)(AlertModals);
