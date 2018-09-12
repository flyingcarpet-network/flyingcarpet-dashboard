import * as React from 'react';
import {Button} from 'reactstrap';

const Footer = () => {
  return (
    <footer className="app-footer">
        <div className="d-flex flex-row justify-content-between">
            <div>
                <span> Copyright Flyingcarpet Network & AIR Network &copy; 2018</span>

            </div>
            <div>
                <Button
                    color="link"
                    href="www.Flyingcarpet.network"
                    target="_blank"
                    size="sm"
                    className="text-uppercase" />
            </div>
        </div>
    </footer>
  )
};

export default Footer;
