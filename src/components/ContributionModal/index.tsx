import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { bindActionCreators, compose } from 'redux';
import * as mapActions from '../../actions/mapActions';
import * as modalsActions from '../../actions/modalsActions';
import * as tcroActions from '../../actions/tcroActions';
import * as Web3Utils from '../../utils/web3-utils';

export interface IProps {
  showStakingDialog: boolean;
  toggleStakingDialog: () => any;
  bountyStakeAmount: number;
  setBountyStakeAmount: (stakeAmount: number) => any;
  web3: any;
  selectedBountyToStake: number;
  toggleBountyStakedSuccessfully: () => any;
  bountyStakedSuccessfully: boolean;
  setBounties: (bounties: any) => any;
  lastSuccessfulBountyTxnHash: string;
  setLastSuccessfulBountyTxnHash: (hash: string) => any;
}

class AlertModals extends React.Component<IProps> {
  public render() {
    const { showStakingDialog, toggleStakingDialog, bountyStakeAmount, bountyStakedSuccessfully, lastSuccessfulBountyTxnHash } = this.props;

    return (
      <div className="text-center">
        <a onClick={toggleStakingDialog}>Staking dialog</a>
        <Modal
          isOpen={showStakingDialog}
          toggle={toggleStakingDialog}>
          <ModalHeader>Stake This Opportunity</ModalHeader>
          {(!bountyStakedSuccessfully) &&
            <ModalBody>
              <b>Nitrogen to stake: </b><input
                onChange={this.onChange}
                value={bountyStakeAmount}
              /><b>NTN</b>
              <br /><br />
              Please enter the amount of Nitrogen you would like to stake in support of the selected data collection opportunity,
              then press the "done" button below. You will then be prompted with two different MetaMask transactions popups.
            </ModalBody>
          }
          {bountyStakedSuccessfully &&
            <ModalBody>
              <b>Bounty successfully staked!</b>
              <br />
              You can view the transaction on <a href={"https://rinkeby.etherscan.io/tx/" + lastSuccessfulBountyTxnHash} target="_blank">EtherScan</a>.
            </ModalBody>
          }
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.contributeToBounty}
            >
              Done
            </Button>
            {' '}
            <Button color="secondary"
              onClick={toggleStakingDialog}
            >
              Cancel
            </Button>
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
    const { web3, selectedBountyToStake, bountyStakeAmount, toggleStakingDialog, setBountyStakeAmount, toggleBountyStakedSuccessfully, setBounties, setLastSuccessfulBountyTxnHash } = this.props;

    Web3Utils.contributeToBounty(web3, selectedBountyToStake, bountyStakeAmount).then(res => {
      // Clear bounty staking input
      setBountyStakeAmount(0);
      // Show success message
      toggleBountyStakedSuccessfully();
      // Set hash of successful bounty
      setLastSuccessfulBountyTxnHash((res as any).transactionHash);
      // Wait 6 seconds
      setTimeout(() => {
        // Close the staking dialog modal
        toggleStakingDialog();
        // Hide success message
        toggleBountyStakedSuccessfully();
        // Reload map bounties
        Web3Utils.getBounties(web3).then(setBounties).catch(err => { console.error('Unable to load bounties!'); console.error(err); });
      }, 6000);
    });
  }
}

export default compose<any>(
  connect(
    state => ({
      showStakingDialog: state.modals.stakingDialog,
      bountyStakeAmount: state.map.bountyStakeAmount,
      selectedBountyToStake: state.map.selectedBountyToStake,
      bountyStakedSuccessfully: state.map.bountyStakedSuccessfully,
      lastSuccessfulBountyTxnHash: state.map.lastSuccessfulBountyTxnHash
    }),
    dispatch => ({
      toggleStakingDialog: bindActionCreators(modalsActions.toggleStakingDialog, dispatch),
      setBountyStakeAmount: bindActionCreators(mapActions.setBountyStakeAmount, dispatch),
      toggleBountyStakedSuccessfully: bindActionCreators(mapActions.toggleBountyStakedSuccessfully, dispatch),
      setBounties: bindActionCreators(tcroActions.setBounties, dispatch),
      setLastSuccessfulBountyTxnHash: bindActionCreators(mapActions.setLastSuccessfulBountyTxnHash, dispatch)
    })
  ),
  withWeb3
)(AlertModals);
