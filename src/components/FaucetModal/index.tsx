import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { bindActionCreators, compose } from 'redux';
import * as modalsActions from '../../actions/modalsActions';
import * as web3Actions from '../../actions/web3Actions';
import { TxnStates } from '../../reducers/dataTypeEnums';
import * as Web3Utils from '../../utils/web3-utils';

export interface IProps {
  web3: any;
  mintedCallback: () => {};
  showFaucetDialog: boolean;
  nitrogenMintTxnState: TxnStates;
  toggleFaucetDialog: () => {};
  setNitrogenMintTxnState: (state: TxnStates) => {};
  lastSuccessfulMintTxnHash: string;
  setLastSuccessfulMintTxnHash: (hash: string) => any;
}

class FaucetModal extends React.Component<IProps> {
  public render() {
    const { showFaucetDialog, toggleFaucetDialog, nitrogenMintTxnState, lastSuccessfulMintTxnHash } = this.props;

    return (
      <div className="text-center">
        <Modal
          isOpen={showFaucetDialog}
          toggle={toggleFaucetDialog}>
          <ModalHeader>Mint Nitrogen (NTN) Token from Faucet</ModalHeader>
          {(nitrogenMintTxnState === TxnStates.DEFAULT) &&
            <ModalBody>
              <div className="form-row">
                <Button
                  className="jr-btn btn-primary btn btn-success"
                  onClick={this.mintToken}
                >
                  Get 100 Nitrogen Tokens
                </Button>
              </div>
              Please click the button above to receive 100 Nitrogen (NTN) tokens. You will then be prompted with a MetaMask transaction popup.
            </ModalBody>
          }
          {(nitrogenMintTxnState === TxnStates.PENDING) &&
            <ModalBody>
              <b>Token minting transaction successfully added to block!</b>
              <br />
              Your NTN balance will update shortly, please be patient. See the transaction pending here: <a href={"https://rinkeby.etherscan.io/tx/" + lastSuccessfulMintTxnHash} target="_blank">EtherScan</a>.
            </ModalBody>
          }
          {(nitrogenMintTxnState === TxnStates.SUBMITTED) &&
            <ModalBody>
              <b>Minting transaction processing... Please confirm the transaction</b>
              <br />
              Please wait... (May take as long as 15 seconds for the transaction to be added to a block)
            </ModalBody>
          }
          {(nitrogenMintTxnState === TxnStates.FAILED) &&
            <ModalBody>
              <b>Token minting failed.</b>
              <br />
              Please check that you have enough ETH for gas.
            </ModalBody>
          }

          <ModalFooter>
            <div className="jr-btn-group">
              <Button
                className="jr-btn btn-primary btn btn-success"
                onClick={toggleFaucetDialog}
              >
                Close
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  private mintToken = () => {
    const { web3, setNitrogenMintTxnState, mintedCallback, toggleFaucetDialog, setLastSuccessfulMintTxnHash } = this.props;

    // Show transaction submitted message
    setNitrogenMintTxnState(TxnStates.SUBMITTED);
    // Mint token via Web3
    Web3Utils.mintToken(web3).then((res: any) => {
      // Show success message
      setNitrogenMintTxnState(TxnStates.PENDING);
      // Show transaction hash (for link to EtherScan)
      setLastSuccessfulMintTxnHash(res.transactionHash);

      // Update the token balance following the mint
      // Use a delay to wait for the data to be updated
      // TODO: Once Metamask supports web-v1.0 subscriptions, use an event subscription instead of a delay
      //       (see: https://github.com/MetaMask/metamask-extension/issues/3642)
      setTimeout(() => {
        setNitrogenMintTxnState(TxnStates.DEFAULT);
        // Call callback passed as prop
        mintedCallback();
        // Close minting dialog
        toggleFaucetDialog();
      }, 20000); // Wait 20 seconds
    }).catch(err => {
      // Show message of failed transaction
      setNitrogenMintTxnState(TxnStates.FAILED);
      // Print error to console
      console.error('There was an error minting the token');
      console.error(err);
    });
  }
}

export default compose<any>(
  connect(
    state => ({
      showFaucetDialog: state.modals.faucetDialog,
      nitrogenMintTxnState: state.web3.nitrogenMintTxnState,
      lastSuccessfulMintTxnHash: state.web3.lastSuccessfulMintTxnHash
    }),
    dispatch => ({
      toggleFaucetDialog: bindActionCreators(modalsActions.toggleFaucetDialog, dispatch),
      setNitrogenMintTxnState: bindActionCreators(web3Actions.setNitrogenMintTxnState, dispatch),
      setLastSuccessfulMintTxnHash: bindActionCreators(web3Actions.setLastSuccessfulMintTxnHash, dispatch)
    })
  ),
  withWeb3
)(FaucetModal);
