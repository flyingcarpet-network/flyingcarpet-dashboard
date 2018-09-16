import * as React from 'react';
import { connect } from 'react-redux';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as modalsActions from '../../actions/modalsActions';

export interface IProps {
  showAboutDialog: boolean;
  toggleAboutDialog: () => any;
}

class AboutModal extends React.Component<IProps> {
  public render() {
    const { showAboutDialog, toggleAboutDialog } = this.props;
    return (
      <div className="text-center">
        <a onClick={toggleAboutDialog}>About</a>
        <Modal
          isOpen={showAboutDialog}
          toggle={toggleAboutDialog}
        >
          <ModalHeader>Flyingcarpet TCRO</ModalHeader>
          <ModalBody>
            <b>balakbababaabkakkb</b><br/>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleAboutDialog}>Done</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    showAboutDialog: state.modals.aboutDialog
  }),
  dispatch => ({
    toggleAboutDialog: bindActionCreators(modalsActions.toggleAboutDialog, dispatch)
  })
)(AboutModal);
