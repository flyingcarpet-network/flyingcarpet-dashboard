// import * as React from 'react';
// import {Button, Modal, ModalHeader} from 'reactstrap';

// class AboutModal extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             message: ''
//         }
//     }

//     render() {
//         const {onMailSend, onClose} = this.props;
//         const {message} = this.state;
//         return (
//             <Modal className="modal-box modal-box-mail" toggle={onClose} isOpen={this.props.open}
//                    style={{zIndex: 2600}}>
//                 <ModalHeader className="modal-box-header bg-primary">
//                     New Message
//                     <span className="text-white pointer" onClick={onClose}>
//                         <i className="zmdi zmdi-close zmdi-hc-lg"/>
//                     </span>
//                 </ModalHeader>
//                 <div className="modal-box-content d-flex flex-column">
//                     <input type="text" className="form-control mb-2" placeholder="Message"
//                            onChange={(event) => this.setState({message: event.target.value})}
//                            value={message}
//                     />
//                 </div>

//                 <div className="modal-box-footer">
//                     <span className="attach-file jr-btn text-muted bg-white">
//                         <i className="zmdi zmdi-attachment mr-2 zmdi-hc-2x"/> Attach File
//                     </span>

//                     <Button disabled={to === ''} color="primary" onClick={() => {
//                         onClose();
//                     }}>
//                         <i className="zmdi zmdi-mail-send mr-2"/> Send Message</Button>
//                 </div>
//             </Modal>
//         );
//     }
// }

// export default AboutModal;
