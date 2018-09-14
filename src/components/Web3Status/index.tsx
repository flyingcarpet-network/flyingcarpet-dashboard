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
    const { web3State, isAnyUnlockedAccount } = this.props;

    return (
      <div>
        {(!web3State.isConnected || web3State.error || !isAnyUnlockedAccount) &&
          <div>- Please ensure that MetaMask is installed and logged in -</div>
        }
      </div>
    );
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
