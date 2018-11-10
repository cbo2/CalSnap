import React from 'react';
import { Button, Modal, Row, Col, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import API from "../../utils/API";
import "./TextInputModal.css";
import moment from "moment"

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
            selectedMeal: ""
        };

        this.toggle = this.toggle.bind(this);
    }

    onResponseFromSearch = () => {
        this.props.onResponseFromSearch();  // callback to our parent so it can reload state from Mongo
    }

    // when the response comes back from the backend need to hit the callback on our parent component (CalorieCount)
    onResponseFromNutritionix = response => {
        let now = new Date().getTime();
        let today = new Date();
        let breakfastStartTime = today.setHours(6, 0, 0, 0);
        let breakfastEndTime = today.setHours(9, 0, 0, 0);
        let lunchStartTime = today.setHours(11, 30, 0, 0);
        let lunchEndTime = today.setHours(14, 0, 0, 0);
        let dinnerStartTime = today.setHours(17, 0, 0, 0);
        let dinnerEndTime = today.setHours(20, 0, 0, 0);
        if ((breakfastStartTime <= now) && (now <= breakfastEndTime)) {
            this.setState({ selectedMeal: "Breakfast" })
        } else if ((lunchStartTime <= now) && (now <= lunchEndTime)) {
            this.setState({ selectedMeal: "Lunch" })
        } else if ((dinnerStartTime <= now) && (now <= dinnerEndTime)) {
            this.setState({ selectedMeal: "Dinner" })
        } else {
            this.setState({ selectedMeal: "Snack" })
        }
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
        console.log(`This is the date: ${this.props.date}`)
        const { quantity, results, selectedMeal } = this.state
        API.createFood({
            item_name: results[index].fields.item_name,
            quantity,
            nf_calories: results[index].fields.nf_calories * quantity,
            nf_protein: results[index].fields.nf_protein * quantity,
            nf_serving_size_unit: results[index].fields.nf_serving_size_unit,
            nf_total_carbohydrate: results[index].fields.nf_total_carbohydrate * quantity,
            username: this.props.username,
            meal: selectedMeal,
            date_consumed: moment(this.props.date + " 00:00:00.000-0600").format("YYYY-MM-DD HH:mm:ss.SSS"),
            date_added: new Date(),
            date_modified: new Date()
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
                <Button color="danger" className="snap-button" onClick={this.toggle}>{this.props.buttonLabel}<i className="fas fa-search"></i></Button>
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
                                                <Input
                                                    type="select"
                                                    name="mealSelect"
                                                    id="meal-select"
                                                    className="form-control form-control-sm modal-meal-selector"
                                                    value={this.state.selectedMeal}
                                                    onChange={e => this.setState({ selectedMeal: e.target.value })}
                                                >
                                                    <option>BreakFast</option>
                                                    <option>Lunch</option>
                                                    <option>Dinner</option>
                                                    <option>Snack</option>
                                                </Input>
                                            </Col>
                                            <Col>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    min="0"
                                                    max="100"
                                                    id="quantityText"
                                                    className="form-control form-control-sm modal-quantity-selector"
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