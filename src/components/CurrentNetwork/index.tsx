import * as React from 'react';
import { connect } from 'react-redux';
import { withWeb3 } from 'react-web3-provider';
import { bindActionCreators, compose } from 'redux';
// import styles from './CurrentNetwork.scss';
import * as web3Actions from '../../actions/web3Actions';
import * as Web3Utils from '../../utils/web3-utils';


export interface IProps {
  web3: any;
  setNetworkName: (name: string) => any;
  networkName: string;
}

class Header extends React.Component<IProps> {

  public componentDidMount() {
    const { web3, setNetworkName } = this.props;

    // Get network name (e.g. rinkeby, main, etc.) using Web3Utils and then save result to Redux
    Web3Utils.getNetworkName(web3)
      .then((name: string) => setNetworkName(name))
      .catch((name: string) => setNetworkName(''));
  }

  public render() {
    let { networkName } = this.props;

    console.log('networkName: ', networkName);

    let classBadge= 'badge badge-error';
    // let style = styles.unknownCircle

    if (networkName !== 'rinkeby' && networkName !== 'main') {
      networkName = 'Unknown Network';
    }

    if (networkName === 'rinkeby') {
      // style= styles.rinkebyCircle;
      classBadge= 'badge badge-info';
      networkName = 'Rinkeby Network';
    }

    if (networkName === 'main') {
      // style= styles.mainnetCircle;
      classBadge= 'badge badge-success';
      networkName = 'Main Ethereum Network';
    }

    return (
      <div>
        <i className="zmdi zmdi-circle zmdi-hc-fw"/>
        <span className={classBadge}>{networkName}</span>

      </div>
    );
  }
}

export default compose<any>(
  connect(
    state => ({
      networkName: state.web3.networkName
    }),
    dispatch => ({
      setNetworkName: bindActionCreators(web3Actions.setNetworkName, dispatch)
    })
  ),
  withWeb3
)(Header);
