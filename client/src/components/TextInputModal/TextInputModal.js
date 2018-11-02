import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import API from "../../utils/API";

class TextInputModal extends React.Component {
   
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.onResponseFromSearch = this.onResponseFromSearch.bind(this);
        this.state = {
            modal: false,
            searchedFood: "",
            firstDisplay: "reveal",
            secondDisplay: "d-none"
        };

        

        this.toggle = this.toggle.bind(this);
    }

    // when the response comes back from the backend need to hit the callback on our parent component (CalorieCount)
    onResponseFromSearch = response => {
        this.props.onResponseFromSearch(response);
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
        // this.toggle();
        event.preventDefault();
        API.nutritionixInstantSearch(this.state.searchedFood).then(response => {
            console.log(`the response back from the search is: ${JSON.stringify(response.data)}`)
            
            this.onResponseFromSearch(response.data)
            // const { item_name, nf_calories } = response.data.hits[0].fields
            // console.log({ item_name, nf_calories } = response.data.hits[0].fields) 
            this.setState ({ firstDisplay: "d-none"})
            this.setState ({ secondDisplay: "reveal"})
                
        })
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
                        <Form className={this.state.firstDisplay}>
                            <FormGroup>
                                <Input type="textarea" name="text" id="foodText" value={this.state.searchedFood} onChange={e => this.setState({ searchedFood: e.target.value })} />
                            </FormGroup>
                            <Button color="primary" onClick={this.handleSearch} className="foodSearch">Search</Button>    
                        </Form>
                        <div className={this.state.secondDisplay}>
                            
                        </div>

                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

export default TextInputModal;