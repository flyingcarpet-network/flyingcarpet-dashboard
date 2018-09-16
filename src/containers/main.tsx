import * as React from 'react';
import {isIOS, isMobile} from 'react-device-detect';
import { connect } from 'react-redux';
import BountyCreationPanel from './../components/BountyCreationPanel';
import Footer from './../components/Footer';
import Header from './../components/Header/index';
import BountyMap from './../components/Map';

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
        <div className="app-container fixed-drawer">
          <div className="app-main-container">
            <div className="app-header">
              <Header />
            </div>
          </div>
          <main className="app-main-content-wrapper">
            <div className="app-main-content">
              <div className="app-wrapper">
                <div>
                  <div className="jr-entry-header">
                      <h3 className="entry-heading">Dashboard</h3>
                  </div>
                  <div className="row mb-md-4">
                    <div className="col-md-6 col-12">
                      <BountyCreationPanel />
                    </div>
                    <div className="col-md-6 col-12">
                      <BountyMap />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
