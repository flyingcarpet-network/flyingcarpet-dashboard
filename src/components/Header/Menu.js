import * as React from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import AboutModal from './../AboutModal';
import BountyModal from './../BountyModal';


class Menu extends React.Component {
    closest(el, selector) {
        try {
            let matchesFn;
            // find vendor prefix
            ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
                if (typeof document.body[fn] === 'function') {
                    matchesFn = fn;
                    return true;
                }
                return false;
            });

            let parent;

            // traverse parents
            while (el) {
                parent = el.parentElement;
                if (parent && parent[matchesFn](selector)) {
                    return parent;
                }
                el = parent;
            }
        } catch (e) {
          console.log('closest menu error');
        }

        return null;
    }


    render() {
        return (
            <div className="app-main-menu d-none d-md-block">
                <ul className="navbar-nav navbar-nav-mega">
                    <li className="nav-item">
                      <AboutModal/>
                    </li>
                    <li className="nav-item">
                      <BountyModal/>
                    </li>
                    <li className="nav-item">
                        <a href="javascript:void(0)">Oracles</a>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/app/oracles/add">
                                    <i className="zmdi zmdi-pin zmdi-hc-fw"/>
                                    <span className="nav-text">Add</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/app/oracles/mine">
                                    <i className="zmdi zmdi-filter-list zmdi-hc-fw"/>
                                    <span className="nav-text">My list</span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}

export default withRouter(Menu);
