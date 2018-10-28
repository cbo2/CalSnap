import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';


class TextInputModal extends React.Component {
    constructor(props) {
        super(props);
        // this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            modal: false,
            searchedFood: ""
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    // handles search button on modal
    handleSearch = (event) => {
        // this.setState({  })
        console.log("this was submitted: " + this.state.searchedFood)
        this.toggle();
        event.preventDefault();
    }

    // handles form input change
    // handleInputChange = event => {
    //     const { name, value } = event.target;
    //     this.setState({
    //         [name]: value
    //     });
    // };

    render() {
        return (
            <div>
                <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}Search Item!!</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Search for a specific item!</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Input type="textarea" name="text" id="foodText" value={this.state.searchedFood} onChange={e => this.setState({ searchedFood: e.target.value })}/>
                            </FormGroup>
                            <Button color="primary" onClick={this.handleSearch} className="foodSearch">Search</Button>
                        </Form>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

export default TextInputModal;