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


    render(props) {
        return (
            <div>
                {console.log("props: ", this.props)}
                <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}{this.props.item_name}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
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