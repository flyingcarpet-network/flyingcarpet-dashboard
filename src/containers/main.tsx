import * as React from 'react';
import {isIOS, isMobile} from 'react-device-detect';
import { connect } from 'react-redux';
import Footer from './../components/Footer';
import Header from './../components/Header/index';
// import BountyMap from './../components/map';
import TopNav from './../components/TopNav';
import './../styles/app-rtl.scss';
import './../styles/app.scss';
import './../styles/bootstrap.scss';

class Main extends React.Component {

  public render() {
      // set default height and overflow for iOS mobile Safari 10+ support.
      if (isIOS && isMobile) {
          document.body.classList.add('ios-mobile-view-height')
      } else if (document.body.classList.contains('ios-mobile-view-height')) {
          document.body.classList.remove('ios-mobile-view-height')
      }
    return (
      <div className="app-main">
        <div className={`app-container fixed-drawer`}>
          <div className="app-main-container">
            <div className="app-header">
              <TopNav/>
              <Header/>
            </div>
          </div>
          <main className="app-main-content-wrapper">
            <div className="app-main-content" />
            {/* <BountyMap/> */}
            <Footer/>
          </main>
        </div>
      </div>
    );
  }
}

export default connect(() => ({
}), dispatch => ({
}))(Main);
