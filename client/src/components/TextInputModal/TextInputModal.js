import React from 'react';
import { Button, Modal, Row, Col, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import API from "../../utils/API";
import "./TextInputModal.css";

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
            results: [],
            selectedItem: [],
            quantity: 1,
            selectedMeal: "Select Meal"
        };

        this.toggle = this.toggle.bind(this);
    }

    onResponseFromSearch = () => {
        this.props.onResponseFromSearch();  // callback to our parent so it can reload state from Mongo
    }

    // when the response comes back from the backend need to hit the callback on our parent component (CalorieCount)
    onResponseFromNutritionix = response => {
        this.setState({ secondDisplay: "reveal" })
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
            modal: !this.state.modal,
            firstDisplay: "reveal",
            secondDisplay: "d-none",
            searchedFood: "",
            quantity: 1
        });
    }

    // handles search button on modal
    handleSearch = (event) => {
        // this.setState({  })
        console.log("this was submitted: " + this.state.searchedFood);
        // this.toggle();
        event.preventDefault();
        API.nutritionixInstantSearch(this.state.searchedFood).then(response => {
            console.log(`the response back from the search is: ${JSON.stringify(response.data)}`)

            this.onResponseFromNutritionix(response.data)
            // const { item_name, nf_calories } = response.data.hits[0].fields
            // console.log({ item_name, nf_calories } = response.data.hits[0].fields) 
            this.setState({ firstDisplay: "d-none" })
        })
    }

    // handles selection of food and calls API to place in database.   
    handleConsume = (index) => {
        console.log(`This is the selected item: ${JSON.stringify(this.state.results[index])}`)
        this.setState({ secondDisplay: "d-none" })
        console.log("quantity: " + this.state.quantity);
        console.log("meal: " + this.state.selectedMeal);
        this.toggle()
        this.setState({ firstDisplay: "reveal" })
        // TO DO: clear out forms after quantity entered
        this.toggle()
        this.setState({ secondDisplay: "d-none" })
        API.createFood({
            item_name: this.state.results[index].fields.item_name,
            quantity: this.state.quantity,
            nf_calories: this.state.results[index].fields.nf_calories * this.state.quantity,
            nf_protein: this.state.results[index].fields.nf_protein * this.state.quantity,
            nf_serving_size_unit: this.state.results[index].fields.nf_serving_size_unit,
            nf_total_carbohydrate: this.state.results[index].fields.nf_total_carbohydrate * this.state.quantity,
            username: this.props.username,
            meal: this.state.selectedMeal,
            date: new Date()
        })
            .then(this.onResponseFromSearch)
            .catch(err => console.log(err))
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
                <Button color="danger" className="snap-button" onClick={this.toggle}>{this.props.buttonLabel}Search Item!!</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader className={this.state.firstDisplay} toggle={this.toggle}>Search for a specific item!</ModalHeader>
                    <ModalHeader className={this.state.secondDisplay} toggle={this.toggle}>Choose an Item to Eat:</ModalHeader>
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
                                    <div key={index + 1000}>
                                        <Row >
                                            <Col>
                                                <b>{oneitem.fields.item_name}</b>
                                            </Col>
                                        </Row>
                                        <Row className="mt-1">
                                            <Col>
                                                Calories: {oneitem.fields.nf_calories} | Serving: {oneitem.fields.nf_serving_size_unit}
                                            </Col>
                                        </Row>
                                        <Row className="mt-2">
                                            <Col>
                                                <Input type="select" name="meal-select" placeholder="Select Meal" id="mealSelect" className="form-control form-control-sm" value={this.state.selectedMeal} onChange={e => this.setState({ selectedMeal: e.target.value })}>
                                                    <option disabled defaultValue={this.state.selectedMeal}>Select Meal</option>
                                                    <option>BreakFast</option>
                                                    <option>Lunch</option>
                                                    <option>Dinner</option>
                                                    <option>Snacks</option>
                                                </Input>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    min="0"
                                                    max="100"
                                                    value={this.state.quantity}
                                                    id="quantityText"
                                                    className="form-control form-control-sm"
                                                    value={this.state.quantity}
                                                    onChange={e => this.setState({ quantity: e.target.value })}
                                                >
                                                </Input>
                                            </Col>
                                            <Col>
                                                <button onClick={this.handleConsume.bind(this, index)} className="results-button" key={index}>Consume</button>
                                            </Col>
                                        </Row>
                                        <hr></hr>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

            </div>
        )
    }
}


export default TextInputModal;