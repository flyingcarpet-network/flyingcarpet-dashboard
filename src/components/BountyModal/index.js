import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

class FormModals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
              <a onClick={this.toggle}>Bounty</a>
              <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggle}
                  className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>
                  Bounty
              </ModalHeader>
                  <ModalBody>
                      FC Dashboard, Bro!
                      <div className="form-group mt-2">
                          <label className="mb-2">Email address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Email"/>
                      </div>
                  </ModalBody>
                  <ModalFooter>
                      <Button color="link" onClick={this.toggle}> Disagree</Button>{' '}
                      <Button color="link" onClick={this.toggle}> Agree</Button>
                  </ModalFooter>
              </Modal>
            </div>
        );
    }
}

export default FormModals;
