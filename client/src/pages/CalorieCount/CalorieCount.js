import React, { Component } from "react";
// import SomeComponent from "../../components/SomeComponent";
// import API from "../../utils/API";
// import axios from "axios";
import './CalorieCount.css';
import { Row, Col, Table} from 'reactstrap';
import Caldisplay from "../../components/Caldisplay";
import Wrapper from "../../components/Wrapper";
import Container from "../../components/Container";
// import { FoodDisplay, FoodItem } from "../../components/FoodDisplay";
// import SnapFoodBtn from "../../components/SnapFoodButton";
import VideoModal from "../../components/VideoModal";
import BarcodeModal from "../../components/BarcodeModal";
import TextInputModal from "../../components/TextInputModal";
import LaunchPage from "../../components/LaunchPage";
// import { Link } from "react-router-dom";
// import ResultsModal from "../../components/ResultsModal";
import API from "../../utils/API";



class CalorieCount extends Component {
    state = {
        dailyGoal: 2200,
        actual: 0,
        remaining: 0,
        isVideoModalOpen: false,
        searchItem: "orange",
        food: [],
        calValues: [],
        item_name: "",
        nf_calories: 0,
        quantity: 0
    };

    componentDidMount() {
        // calculates remaining calories for day        
        this.loadFood();

        API.getUser({
            username: this.props.username
        })
            .then(res => {
                if (!res.data) {
                    API.createUser({
                        username: this.props.username
                    })
                        .then(res => console.log("User created: ", res.data))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
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
        let today = new Date();
        let dd = today.getDate();
        var mm = today.getMonth() + 1
        console.log("This is the date: ", mm + "/" + dd);
        console.log("This is username: ", this.props.username);
        API.getSavedFoods({ username: this.props.username })
            .then(res =>
                this.setState({ food: res.data, item_name: "", nf_calories: "", quantity: "" })
            ).then(res => this.doDashboardCalculation())
            .catch(err => console.log(err));
        // console.log("here are the foods: " + JSON.stringify(this.state.food));
    };

    // finds sum of total calories in food array and subtracts from daily goal
    doDashboardCalculation = () => {
        this.setState({ calValues: []})
        this.setState({ actual: 0})
        this.setState({ remaining: this.state.dailyGoal})
        this.state.food.map(food => (
            this.setState({ calValues: this.state.calValues.concat(food.nf_calories) })
        ))
        const add = (a, b) => a + b
        const sum = (this.state.calValues).reduce(add)
        this.setState({ actual: Math.round(sum) })
        this.setState({ remaining: this.state.dailyGoal - this.state.actual });
        // console.log("here are the cal values: ", this.state.calValues)
        // console.log("this is the sum: ", sum)
        // console.log("this is the actual: ", this.state.actual)
    }

    deleteFood = id => {
        API.deleteFood(id)
            .then(res => this.loadFood())
            .catch(err => console.log(err));
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
    // handleSearchSubmit = event => {
    //     event.preventDefault();

    //     // API.hitapi({
    //     // })
    //     //     .then(res => {
    //     //             return res
    //     //         })
    //     //     })
    //     //     .catch(err => console.log(err));
    // }

    // Generic component state handler when the user types into the input field
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    // handleIRresponse = response => {
    //     // TODO - first check for an error ERR-100
    //     if (response.code.startsWith("ERR-100")) {
    //         alert(`Image is not identifyable!`)
    //     } else {
    //         // destructure the response 
    //         let all = response.data.hits.map((oneitem, index) => {   // map over the 5 responses
    //             let { item_name, nf_calories } = oneitem.fields   // example of destructuring on one item/row
    //             return (`<li>${item_name} ${nf_calories}</li>`)   // use html list items instead of regular text as an example.  These actaully work in a modal but not here in alert!
    //         }).join('')         // use join with null to avoid commas in-between each item
    //         // alert(`<ul>${all}</ul`)
    //     }
    // }

    // handleBarcodeResponse = response => {
    //     // NOTE:  there is nothing to iterate over here!  Barcode is exact and returns exactly 1 item!!!
    //     console.log(`the response in the callback for barcode is: ${JSON.stringify(response)}`)
    //     if (response.code !== "000") {
    //         alert(`something went wrong with the barcode reader.  Try again!`)
    //     } else {
    //         // destructure the response 
    //         // for now, backend is returning ONLY 1 response 
    //         const { food_name, nf_calories } = response.data
    //         alert(`Item identified as: ${food_name}  ${nf_calories}`)
    //     }
    // }

    handleSearchResponse = response => {
        console.log(`*** inside callback from Search and about to reload state from the Mongo ***`)
        this.loadFood()
    }

    render() {
        const loggedIn = this.props.auth.isAuthenticated();
        if (loggedIn) {
            return (<Wrapper>
                <Container>
                    <Caldisplay
                        dailyGoal={this.state.dailyGoal}
                        actual={this.state.actual}
                        remaining={this.state.remaining}

                    />
                    <div className="row button-row">
                        {/* <div className="col" > */}
                        <VideoModal isOpen={this.state.isVideoModalOpen}
                            onResponseFromSearch={this.handleSearchResponse} {...this.props}
                            onClose={this.toggleModal} buttonLabel="Snap Food!">
                        </VideoModal>

                        <BarcodeModal
                            onResponseFromSearch={this.handleSearchResponse} {...this.props}
                            buttonLabel="Scan Barcode!!">
                        </BarcodeModal>

                        <TextInputModal onResponseFromSearch={this.handleSearchResponse} {...this.props}>
                        </TextInputModal>
                        {/* </div> */}
                    </div>
                    {this.state.food.length ? (
                        <Table className="results-table">

                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Cals</th>
                                    <th>#</th>
                                    {/* <th>Update</th> */}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.food.map(food => (
                                    <tr key={food._id}>

                                        <td>{food.item_name}</td>
                                        <td>{food.nf_calories}</td>
                                        <td>{food.quantity}</td>
                                        {/* <td><button className="btn">U</button></td> */}
                                        <td><button onClick={() => this.deleteFood(food._id)} className="btn btn-danger delete-button" data-id={food._id}>X</button></td>

                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                    ) : (
                            <h3>Start Snapping to see results!</h3>
                        )}


                </Container>
            </Wrapper>
            )
        } else {
            return (<LaunchPage></LaunchPage>)
        }
    }
};


export default CalorieCount;