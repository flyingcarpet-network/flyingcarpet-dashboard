import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import * as web3Actions from '../../actions/web3Actions';
import * as Web3Utils from '../../utils/web3-utils';

export interface IProps {
  web3: any;
  web3State: any;
  setIsAnyUnlockedAccount: (isUnlocked: boolean) => any;
  isAnyUnlockedAccount: boolean;
}

class Header extends React.Component<IProps> {
  public componentDidMount() {
    const { web3, setIsAnyUnlockedAccount } = this.props;

    // Check if there are any unlocked accounts using Web3Utils and then save result to Redux
    Web3Utils.isAnyUnlockedAccount(web3)
      .then(() => setIsAnyUnlockedAccount(true))
      .catch(() => setIsAnyUnlockedAccount(false));
  }
  public render() {
    return (
      <div>
        <button className="jr-btn jr-btn-xs jr-btn-primary btn btn-default">{this.determineWeb3StatusMessage()}</button>
      </div>
    );
  }
  private determineWeb3StatusMessage() {
    const { web3State, isAnyUnlockedAccount } = this.props;

    const noWeb3Failure = 'Please use MetaMask';
    const noUnlockedAccountFailure = 'Please unlock your MetaMask account';
    const success = 'Connected to MetaMask';

    if (!web3State.isConnected || web3State.error) { return noWeb3Failure; }

    if (!isAnyUnlockedAccount) { return noUnlockedAccountFailure; }
    return success;
  }
}

export default compose<any>(
  connect(
    state => ({
      isAnyUnlockedAccount: state.web3.isAnyUnlockedAccount
    }),
    dispatch => ({
      setIsAnyUnlockedAccount: bindActionCreators(web3Actions.setIsAnyUnlockedAccount, dispatch)
    })
  ),
  withWeb3
)(Header);
