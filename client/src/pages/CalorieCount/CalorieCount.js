import React, { Component } from "react";
import { Table, Row, Col, Input, Label, Progress } from 'reactstrap';
import './CalorieCount.css';
import Caldisplay from "../../components/Caldisplay";
import Wrapper from "../../components/Wrapper";
import Container from "../../components/Container";
// import { FoodDisplay, FoodItem } from "../../components/FoodDisplay";
// import SnapFoodBtn from "../../components/SnapFoodButton";
import VideoModal from "../../components/VideoModal";
import BarcodeModal from "../../components/BarcodeModal";
import TextInputModal from "../../components/TextInputModal";
import LaunchPage from "../../components/LaunchPage";
import UpdateModal from "../../components/UpdateModal";
// import ResultsModal from "../../components/ResultsModal";
import API from "../../utils/API";

class CalorieCount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dailyGoal: 2000,
            actual: 0,
            remaining: 0,
            progress: 0,
            progressColor: "success",
            isVideoModalOpen: false,
            searchItem: "orange",
            food: [],
            calValues: [],
            item_name: "",
            nf_calories: 0,
            quantity: 0,
            remainingStatus: "cal-actual",
            meal: "",
            // toDate: new Date().getDate(),
            // fromDate: new Date().getDate()
        }
    }
    componentDidMount() {
        // calculates remaining calories for day 
        if (this.props.auth.isAuthenticated()) {
            // this.loadFood();
        }

        API.getUser({
            username: this.props.username
        })
            .then(res => {
                if (!res.data && this.props.auth.isAuthenticated()) {
                    API.createUser({
                        username: this.props.username
                    })
                        .then(res => console.log("User created: ", res.data))
                        .catch(err => console.log(err));
                } else {
                    console.log(`===> the response from getting the user on mouting is: ${JSON.stringify(res.data)}`)
                    this.setState({ dailyGoal: res.data.calorieGoal })
                }
            })
            .then(this.loadFood())
            .catch(err => console.log(err));

    }


    loadFood = () => {
        let tomorrow = new Date();
        let today = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        API.getFoodsbyUserAndDateRange({
            username: this.props.username,
            today,
            tomorrow
        })
            .then(res =>
                this.setState({ food: res.data, item_name: "", nf_calories: "", quantity: "" })
            ).then(res => this.doDashboardCalculation())
            .catch(err => console.log(err));
        // console.log("here are the foods: " + JSON.stringify(this.state.food));
    };

    // finds sum of total calories in food array and subtracts from daily goal
    doDashboardCalculation = () => {
        this.setState({ calValues: [] })
        this.setState({ actual: 0 })
        this.setState({ remaining: this.state.dailyGoal })
        this.state.food.map(food => (
            this.setState({ calValues: this.state.calValues.concat(food.nf_calories) })
        ))
        const add = (a, b) => a + b
        const sum = (this.state.calValues).reduce(add)
        this.setState({ actual: Math.round(sum) })
        this.setState({ remaining: this.state.dailyGoal - this.state.actual });
        this.setState({ progress: (this.state.actual / this.state.dailyGoal)*100 })
        console.log("this is the progress percent: ", this.state.progress)
        // this updates remaining color based on value
        if (this.state.progress > 75) {
            this.setState({ remainingStatus: "cal-red" })
        } else {
            this.setState({ remainingStatus: "cal-goal" })
        }

        // this updates progress bar color base on value
        if (this.state.progress > 75) {
            this.setState({ progressColor: "danger"})
        } else if (this.state.progress < 75 && this.state.progress > 60) {
            this.setState({ progressColor: "warning"})
        } else if (this.state.progress < 60) {
            this.setState({ progressColor: "success" })
        }
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


    handleSearchResponse = response => {
        console.log(`*** inside callback from Search and about to reload state from the Mongo ***`)
        this.loadFood()
    }

    render() {
        const loggedIn = this.props.auth.isAuthenticated();
        if (loggedIn) {
            return (<Wrapper>
                <Container className="container-fluid">
                    <Row className="scoreboard-row">
                        <Col xl="12">
                            <Caldisplay
                                dailyGoal={this.state.dailyGoal}
                                actual={this.state.actual}
                                remaining={this.state.remaining}
                                remainingStatus={this.state.remainingStatus}
                            />
                        </Col>

                        <Col xl="12">
                            <div className="bar-row">
                            {/* <div className="text-center">{this.state.progress}%</div> */}
                            <Progress color={this.state.progressColor}value={this.state.progress} />
                            </div>
                        </Col>
                    </Row>

                    <Row className="button-row justify-content-center">

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

                    </Row>
                    <Row className="row selector-row">
                        {/* <Col xs="1" className="label">
                            
                        </Col> */}
                        <Col className="col-4 p-1">
                            <Label for="meal-select" className="col-form-label" id="label">Meal: </Label>
                            <Input
                                type="select"
                                name="mealSelect"
                                id="meal-select"
                                className="form-control form-control-sm selector"
                                value={this.state.meal}
                                onChange={e => this.setState({ meal: e.target.value })}
                            >
                                <option>All</option>
                                <option>BreakFast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Snack</option>
                            </Input>
                        </Col>
                        {/* <Col xs="1">
                            
                        </Col> */}
                        <Col className="col-4 p-1">
                            <Label for="from-date-select" className="col-form-label" id="label">From: </Label>
                            <Input
                                type="date"
                                name="fromDateSelect"
                                id="from-date-select"
                                className="form-control form-control-sm selector"
                                value={this.state.fromDate}
                                onChange={e => this.setState({ fromDate: e.target.value })}
                            >
                            </Input>
                        </Col>
                        {/* <Col xs="1">
                            
                        </Col> */}
                        <Col className="col-4 p-1">
                            <Label for="to-date-select" className="col-form-label" id="label">To: </Label>
                            <Input
                                type="date"
                                name="toDateSelect"
                                id="to-date-select"
                                className="form-control form-control-sm selector"
                                value={this.state.toDate}
                                onChange={e => this.setState({ toDate: e.target.value })}
                            >
                            </Input>
                        </Col>
                    </Row>
                    {this.state.food.length ? (
                        <Table className="results-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Cals</th>
                                    <th>#</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.food.map(food => (
                                    <tr key={food._id}>
                                        <td><UpdateModal onResponseFromSearch={this.handleSearchResponse} inputVal={food.item_name} id={food._id}></UpdateModal></td>
                                        {/* <td className="item-name" onClick={() => this.updateFood()}><a>{food.item_name}</a></td>        */}
                                        <td>{Math.round(food.nf_calories)}</td>
                                        <td>{food.quantity}</td>
                                        <td><button onClick={() => this.deleteFood(food._id)} className="btn btn-danger delete-button" data-id={food._id}>X</button></td>

                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                            <Row>
                                <Col xl="12" className="mt-2">
                                    <h3>Start Snapping for results!</h3>
                                </Col>
                            </Row>

                        )}
                </Container>
            </Wrapper>
            )
        } else {
            return (<LaunchPage {...this.props}></LaunchPage>)
        }
    }
};


export default CalorieCount;