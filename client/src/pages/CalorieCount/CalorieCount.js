import React, { Component } from "react";
// import SomeComponent from "../../components/SomeComponent";
// import API from "../../utils/API";
import axios from "axios";
import './CalorieCount.css';
import {
    Jumbotron,
    Modal,
    Button,
    Form
} from "reactstrap";
import Caldisplay from "../../components/Caldisplay";
import Wrapper from "../../components/Wrapper";
import Container from "../../components/Container";
import FoodDisplay from "../../components/FoodDisplay";
import SnapFoodBtn from "../../components/SnapFoodButton";
import VideoModal from "../../components/VideoModal";
import BarcodeModal from "../../components/BarcodeModal";
import TextInputModal from "../../components/TextInputModal";
import LaunchPage from "../../components/LaunchPage";
import API from "../../utils/API";



class CalorieCount extends Component {
    state = {
        dailyGoal: 2200,
        actual: 500,
        remaining: 0,
        isVideoModalOpen: false,
        searchItem: "orange"
    };

    componentDidMount() {
        // calculates remaining calories for day
        this.setState({ remaining: this.state.dailyGoal - this.state.actual })

        // temporary location to call nutritionix API
        // API.nutritionixNutritionSearch({})
        // this.nutritionixInstantSearch()
        // this.nutritionixBarcode()
        // API.nutritionixInstantSearch({
        //     searchItem: this.state.searchItem
        // })
        // API.nutritionixBarcodeSearch({})

    }

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
            // for now, backend is returning the top 5 responses in an array of hits
            const { item_name, nf_calories } = response.data.hits[0].fields
            alert(`Item identified as: ${item_name}  ${nf_calories}`)
            // alert(`Item identified as: ${JSON.stringify(response)}`)
        }
    }

    handleBarcodeResponse = response => {
        if (response.code != "000") {
            alert(`something went wrong with the barcode reader.  Try again!`)
        } else {
            // destructure the response 
            // for now, backend is returning the top 5 responses in an array of hits
            const { item_name, nf_calories } = response.data.hits[0].fields
            alert(`Item identified as: ${item_name}  ${nf_calories}`)
        }
    }

    handleSearchResponse = response => {
        if (response.code != "000") {
            alert(`something went wrong with the search.  Try again!`)
        } else {
            // destructure the response 
            // for now, backend is returning the top 5 responses in an array of hits
            const { item_name, nf_calories } = response.data.hits[0].fields
            alert(`Item identified as: ${item_name}  ${nf_calories}`)
        }
    }

    render(props) {
        const loggedIn = this.props.auth.isAuthenticated();

        if (loggedIn) {
            return (<Wrapper {...props}>
                <div>Welcome to CalSnap, {this.props.name}</div>
                <Container>
                    <Caldisplay
                        dailyGoal={this.state.dailyGoal}
                        actual={this.state.actual}
                        remaining={this.state.remaining}
                    />
                    {/* <SnapFoodBtn onClick={() => this.snapFood()} /> */}
                    <div className="row">
                        <VideoModal isOpen={this.state.isVideoModalOpen}
                            onResponseFromIR={this.handleIRresponse}
                            onClose={this.toggleModal} buttonLabel="Snap Food!">
                            Here's some content for the modal
                        </VideoModal>
                        <BarcodeModal
                            onResponseFromBarcode={this.handleBarcodeResponse}
                            buttonLabel="Scan Barcode!!">
                        </BarcodeModal>
                        <TextInputModal onResponseFromSearch={this.handleSearchResponse}>
                        </TextInputModal>
                    </div>
                    <FoodDisplay>
                        {/* will map through DB results when built       */}
                        {/* {this.state.foodItems.map(food-item => (
                                
                                ))} */}
                    </FoodDisplay>
                </Container>

            </Wrapper>

            )
        } else {
            return (<LaunchPage></LaunchPage>)
        }
    }

};


export default CalorieCount;