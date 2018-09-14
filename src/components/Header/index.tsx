import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
import * as web3Actions from '../../actions/web3Actions';
import * as Web3Utils from '../../utils/web3-utils';
import SearchBox from './../SearchBox';

export interface IProps {
  web3: any;
  web3State: any;
  setIsAnyUnlockedAccount: (isUnlocked: boolean) => any;
  setNetworkName: (name: string) => any;
  setNitrogenBalance: (balance: number) => any;
  isAnyUnlockedAccount: boolean;
  networkName: string;
  nitrogenBalance: number;
}

class Header extends React.Component<IProps> {
  public componentDidMount() {
    const { web3, setIsAnyUnlockedAccount, setNetworkName, setNitrogenBalance } = this.props;

    // Check if there are any unlocked accounts using Web3Utils and then save result to Redux
    Web3Utils.isAnyUnlockedAccount(web3)
      .then(() => setIsAnyUnlockedAccount(true))
      .catch(() => setIsAnyUnlockedAccount(false));

    // Get network name (e.g. rinkeby, main, etc.) using Web3Utils and then save result to Redux
    Web3Utils.getNetworkName(web3)
      .then((name: string) => setNetworkName(name))
      .catch((name: string) => setNetworkName(''));

    // Get current account address and use it to get the current Nitrogen token balance using
    // Web3Utils, then save the result to Redux
    Web3Utils.getDefaultAccount(web3).then(address => {
      Web3Utils.getNitrogenBalance(web3, address)
        .then((balance: number) => setNitrogenBalance(balance))
        .catch((balance: number) => setNitrogenBalance(0));
    }).catch((balance: number) => setNitrogenBalance(0));
  }
  public render() {
    const { web3State, isAnyUnlockedAccount, networkName, nitrogenBalance } = this.props;

    return (
      <div className="app-main-header">
        <div className="d-flex app-toolbar align-items-center">
          <div className="app-logo-bl">
              <div className="d-block d-md-none">
                  <span className="jr-menu-icon">
                      <span className="menu-icon"/>
                  </span>
              </div>
              <div className="app-logo pointer d-none d-md-block">
                  <img className="d-none d-lg-block" alt='...' src='/assets/images/logo.png'/>
                  <img className="d-block d-lg-none mr-3" alt='...'
                       src='http://via.placeholder.com/32x32'/>
              </div>
          </div>

          <SearchBox styleName="d-none d-lg-block"/>

          {(!web3State.isConnected || web3State.error || !isAnyUnlockedAccount) &&
            <div>- Please ensure that MetaMask is installed and logged in -</div>
          }
          <div>- Current Network: {networkName} -</div>
          <div>- NTN Balance: {nitrogenBalance} -</div>
        </div>
      </div>
    );
  }
}

export default compose<any>(
  connect(
    state => ({
      isAnyUnlockedAccount: state.web3.isAnyUnlockedAccount,
      networkName: state.web3.networkName,
      nitrogenBalance: state.web3.nitrogenBalance
    }),
    dispatch => ({
      setIsAnyUnlockedAccount: bindActionCreators(web3Actions.setIsAnyUnlockedAccount, dispatch),
      setNetworkName: bindActionCreators(web3Actions.setNetworkName, dispatch),
      setNitrogenBalance: bindActionCreators(web3Actions.setNitrogenBalance, dispatch)
    })
  ),
  withWeb3
)(Header);
