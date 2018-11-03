import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import API from "../../utils/API";
import "./TextInputModal.css";
import { isThisWeek } from 'date-fns';
import { format } from 'path';

class TextInputModal extends React.Component {

    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.onResponseFromSearch = this.onResponseFromSearch.bind(this);
        this.state = {
            modal: false,
            searchedFood: "",
            firstDisplay: "reveal",
            secondDisplay: "d-none",
            thirdDisplay: "d-none",
            results: [],
            selectedItem: [],
            quantity: 1

        };



        this.toggle = this.toggle.bind(this);
    }

    // when the response comes back from the backend need to hit the callback on our parent component (CalorieCount)
    onResponseFromSearch = response => {
        this.setState({ secondDisplay: "reveal" })
        this.props.onResponseFromSearch(response);
        if (response.code != "000") {
            alert(`something went wrong with the search.  Try again!`)
        } else {
            // destructure the response 
            // for now, backend is returning the top 5 responses in an array of hits
            // let all = response.data.hits.map((oneitem, index) => {
            //     let { item_name, nf_calories } = oneitem.fields  // example of destructuring on one item/row
            // return (`<button>${index + 1}: ${item_name} ${nf_calories}</button>`)
            // }).join('')         // use join with null to avoid commas in-between each item
            // console.log(`the value for all is ${all}`)
            // this.setState ({results: all})
            this.setState({ results: response.data.hits })
        }
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
            this.setState({ firstDisplay: "d-none" })


        })
    }

    // selects item from results
    selectItem = (index, event) => {
        // event.preventDefault();
        console.log(this.state.results[index])
        this.setState({ selectedItem: this.state.results[index] })
        console.log(this.state.selectedItem)
        // this.setState ({ firstDisplay: "reveal"})
        // this.toggle()
        this.setState({ secondDisplay: "d-none" })
        this.selectQuantity();
    }

    //initializes quantity form    
    selectQuantity = (index, event) => {
        this.setState({ thirdDisplay: "reveal" })
    }

    // handles quantity capture    
    handleQuantity = (event) => {
        event.preventDefault();
        console.log("quantity: " + this.state.quantity)
        this.toggle()
        this.setState({ thirdDisplay: "d-none" })
        this.setState({ firstDisplay: "reveal" })
        // TO DO: clear out forms after quantity entered
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
                    <ModalHeader className={this.state.firstDisplay} toggle={this.toggle}>Search for a specific item!</ModalHeader>
                    <ModalHeader className={this.state.secondDisplay} toggle={this.toggle}>Choose an Item to Eat:</ModalHeader>
                    <ModalHeader className={this.state.thirdDisplay} toggle={this.toggle}>Enter a Quantity:</ModalHeader>
                    <ModalBody>
                        <Form className={this.state.firstDisplay}>
                            <FormGroup>
                                <Input type="textarea" name="text" id="foodText" value={this.state.searchedFood} onChange={e => this.setState({ searchedFood: e.target.value })} />
                            </FormGroup>
                            <Button color="primary" onClick={this.handleSearch} className="foodSearch">Search</Button>
                        </Form>
                        <div className={this.state.secondDisplay}>
                            <div>
                                {this.state.results.map((oneitem, index) => (
                                    <p>
                                        <button onClick={this.selectItem.bind(this, index)} className="results-button" key={index}>{oneitem.fields.item_name} ||| Calories: {oneitem.fields.nf_calories}</button>
                                    </p>
                                ))}
                            </div>
                        </div>
                        <Form className={this.state.thirdDisplay}>
                            <FormGroup>
                                <Input type="textarea" name="text" id="quantityText" value={this.state.quantity} onChange={e => this.setState({ quantity: e.target.value })} />
                            </FormGroup>
                            <Button color="primary" onClick={this.handleQuantity} className="select-quantity">Enter</Button>
                        </Form>

                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

export default TextInputModal;