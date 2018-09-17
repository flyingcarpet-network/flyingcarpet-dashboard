import * as React from 'react';
import {isIOS, isMobile} from 'react-device-detect';
import BountyCreationPanel from './../components/BountyCreationPanel';
import BountyStatusFilter from './../components/BountyStatusFilter';
// import Footer from './../components/Footer';
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
        <div className="app-container">
          <div className="app-main-container">
            <div className="app-header">
              <Header />
            </div>
            <main className="app-main-content-wrapper">
              <div className="app-main-content">
                <div className="app-wrapper">
                  <div className="row">
                      <div className="col-sm-4 col-md-4 col-lg-3 col-12 pull-right" style={{zIndex: 90}}>
                        <BountyStatusFilter />
                      </div>
                  </div>
                  <div className="row"/>
                      <div className="col-sm-4 col-md-4 col-lg-3 col-12" />
                  <div className="row">
                      <div className="col-sm-4 col-md-4 col-lg-3 col-12">
                        <BountyCreationPanel />
                      </div>
                      <BountyMap />
                  </div>
                </div>
              </div>
              {/* <Footer/> */}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
