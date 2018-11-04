import React, { Component } from "react";
// import SomeComponent from "../../components/SomeComponent";
// import API from "../../utils/API";
// import axios from "axios";
import './CalorieCount.css';
import { Button, Modal, Row, Col, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import Caldisplay from "../../components/Caldisplay";
import Wrapper from "../../components/Wrapper";
import Container from "../../components/Container";
import { FoodDisplay, FoodItem } from "../../components/FoodDisplay";
// import SnapFoodBtn from "../../components/SnapFoodButton";
import VideoModal from "../../components/VideoModal";
import BarcodeModal from "../../components/BarcodeModal";
import TextInputModal from "../../components/TextInputModal";
import LaunchPage from "../../components/LaunchPage";
import { Link } from "react-router-dom";
// import ResultsModal from "../../components/ResultsModal";
import API from "../../utils/API";



class CalorieCount extends Component {
    state = {
        dailyGoal: 2200,
        actual: 500,
        remaining: 0,
        isVideoModalOpen: false,
        searchItem: "orange",
        food: [],
        item_name: "",
        nf_calories: 0,
        quantity: 0
    };

    componentDidMount() {
        // calculates remaining calories for day
        this.setState({ remaining: this.state.dailyGoal - this.state.actual })
        this.loadFood()
        // temporary location to call nutritionix API
        // API.nutritionixNutritionSearch({})
        // this.nutritionixInstantSearch()
        // this.nutritionixBarcode()
        // API.nutritionixInstantSearch({
        //     searchItem: this.state.searchItem
        // })
        // API.nutritionixBarcodeSearch({})

    }

    loadFood = () => {
        API.getFood()
            .then(res =>
                this.setState({ food: res.data, item_name: "", nf_calories: "", quantity: "" })
            )
            .catch(err => console.log(err));
        console.log("here are the foods: " + this.state.food)
    };

    toggleModal = () => {
        console.log(`modal state is: ${this.state.isVideoModalOpen}`)
        this.setState({
            isVideoModalOpen: !this.state.isVideoModalOpen
        });
        console.log(`modal state is: ${this.state.isVideoModalOpen}`)
    }

    snapFood = event => {
        // event.preventDefault();
        console.log("click is working")
        this.toggleModal()
    }

    // handle the form search button to kick off the search to the NYT
    handleSearchSubmit = event => {
        event.preventDefault();

        // API.hitapi({
        // })
        //     .then(res => {
        //             return res
        //         })
        //     })
        //     .catch(err => console.log(err));
    }

    // Generic component state handler when the user types into the input field
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleIRresponse = response => {
        // TODO - first check for an error ERR-100
        if (response.code.startsWith("ERR-100")) {
            alert(`Image is not identifyable!`)
        } else {
            // destructure the response 
            let all = response.data.hits.map((oneitem, index) => {   // map over the 5 responses
                let { item_name, nf_calories } = oneitem.fields   // example of destructuring on one item/row
                return (`<li>${item_name} ${nf_calories}</li>`)   // use html list items instead of regular text as an example.  These actaully work in a modal but not here in alert!
            }).join('')         // use join with null to avoid commas in-between each item
            alert(`<ul>${all}</ul`)
        }
    }

    handleBarcodeResponse = response => {
        // NOTE:  there is nothing to iterate over here!  Barcode is exact and returns exactly 1 item!!!
        console.log(`the response in the callback for barcode is: ${JSON.stringify(response)}`)
        if (response.code !== "000") {
            alert(`something went wrong with the barcode reader.  Try again!`)
        } else {
            // destructure the response 
            // for now, backend is returning ONLY 1 response 
            const { food_name, nf_calories } = response.data
            alert(`Item identified as: ${food_name}  ${nf_calories}`)
        }
    }

    handleSearchResponse = response => {
        // if (response.code != "000") {
        //     // alert(`something went wrong with the search.  Try again!`)
        // } else {
        //     // destructure the response 
        //     // for now, backend is returning the top 5 responses in an array of hits
        //     let all = response.data.hits.map((oneitem, index) => {
        //         let { item_name, nf_calories } = oneitem.fields  // example of destructuring on one item/row
        //         return (`${index + 1}: ${item_name} ${nf_calories}\n`)
        //     }).join('')         // use join with null to avoid commas in-between each item
        //     // console.log(`the value for all is ${all}`)
        //     // alert(`${all}`)
        // }
    }

    render() {
        const loggedIn = this.props.auth.isAuthenticated();

        if (loggedIn) {
            return (<Wrapper>
                <div>Welcome to CalSnap, {this.props.name}</div>
                <Container>
                    <Caldisplay
                        dailyGoal={this.state.dailyGoal}
                        actual={this.state.actual}
                        remaining={this.state.remaining}

                    />
                    <div className="row button-row">
                        {/* <div className="col" > */}
                            <VideoModal isOpen={this.state.isVideoModalOpen}
                                onResponseFromIR={this.handleIRresponse}
                                onClose={this.toggleModal} buttonLabel="Snap Food!">
                            </VideoModal>
                         
                            <BarcodeModal
                                onResponseFromBarcode={this.handleBarcodeResponse}
                                buttonLabel="Scan Barcode!!">
                            </BarcodeModal>
                         
                            <TextInputModal onResponseFromSearch={this.handleSearchResponse} {...this.props}>
                            </TextInputModal>   
                        {/* </div> */}
                    </div>
                    <div className="row">
                        <div className="col">
                        {this.state.food.length ? (
                            <FoodDisplay>
                                {this.state.food.map(food => (
                                    <FoodItem key={food._id}>
                                      
                                          {food.item_name}
                                          {food.nf_calories}
                                          {food.quantity}
                                            
                                    </FoodItem>
                                ))}
                            </FoodDisplay>
                        ) : (
                            <h3>Start Snapping!</h3>
                          )}
                        </div>
                    </div>
                </Container>
            </Wrapper>
            )
        } else {
            return (<LaunchPage></LaunchPage>)
        }
    }
};


export default CalorieCount;