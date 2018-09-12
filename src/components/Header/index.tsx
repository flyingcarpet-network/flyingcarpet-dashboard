import * as React from 'react';

class Header extends React.Component {
    public render() {
      return (
            <div className="app-main-header">
                <div className="d-flex app-toolbar align-items-center">
                    <div className="app-logo-bl">
                        <div className="d-block d-md-none" />
                        <div className="app-logo pointer d-none d-md-block">
                            <img className="d-none d-lg-block" alt='...' src='http://via.placeholder.com/105x36'/>
                            <img className="d-block d-lg-none mr-3" alt='...'
                                 src='http://via.placeholder.com/32x32'/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
