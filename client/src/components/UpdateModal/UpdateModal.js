import React from 'react';
import { Button, Modal, ModalFooter, Row, Col, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import API from "../../utils/API";
import "./UpdateModal.css";

class UpdateModal extends React.Component {
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
                <a onClick={this.toggle}>{this.props.buttonLabel}{this.props.inputVal}</a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Update {this.props.inputVal}</ModalHeader>
                    <ModalBody>
                        Test Modal
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}


export default UpdateModal;