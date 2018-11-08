import React from 'react';
import { Button, Modal, ModalFooter, ModalHeader, ModalBody, Row, Col, Input } from 'reactstrap';
import API from "../../utils/API";
import "./UpdateModal.css";

class UpdateModal extends React.Component {
    constructor(props) {
        super(props);
        // this.handleSearch = this.handleSearch.bind(this);
        // this.onResponseFromSearch = this.onResponseFromSearch.bind(this);
        this.state = {
            modal: false,
            firstDisplay: "reveal",
            secondDisplay: "d-none",
            item_name: "",
            meal: "",
            nf_calories: 0,
            nf_protein: 0,
            nf_serving_size_unit: "",
            nf_total_carbohydrate: 0,
            quantity: 0,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            firstDisplay: "reveal",
            secondDisplay: "d-none"
        });
    }

    componentDidMount() {
        API.getFoodbyId(this.props.id)
            .then(res => this.setState({ food: res.data }))
            .then(res =>
                this.setState({
                    item_name: this.state.food[0].item_name,
                    meal: this.state.food[0].meal,
                    nf_calories: this.state.food[0].nf_calories,
                    nf_protein: this.state.food[0].nf_protein,
                    nf_serving_size_unit: this.state.food[0].nf_serving_size_unit,
                    nf_total_carbohydrate: this.state.food[0].nf_total_carbohydrate,
                    quantity: this.state.food[0].quantity
                })).then(res => {
                    if ((this.state.quantity > 1) && (`${this.state.nf_serving_size_unit}`.charAt(`${this.state.nf_serving_size_unit}`.length-1) !== "s")) {
                        let pluralServingSize = this.state.nf_serving_size_unit + "s"
                        this.setState({ nf_serving_size_unit: pluralServingSize })
                    }
                })
            .catch(err => console.log(err));
    }

    onResponseFromUpdateSubmit = () => {
        this.props.onResponseFromSearch();  // callback to our parent so it can reload state from Mongo
    }

    handleUpdateClick = () => {
        this.setState({
            firstDisplay: "d-none",
            secondDisplay: "reveal"
        })
    }

    handleUpdateSubmit = () => {
        this.setState({ secondDisplay: "d-none" })
        this.toggle()
        this.setState({ firstDisplay: "reveal" })
        this.toggle()
        this.setState({ secondDisplay: "d-none" })
        const { quantity, nf_calories, nf_protein, nf_serving_size_unit, nf_total_carbohydrate, meal } = this.state
        API.updateFood(this.props.id, {
            quantity,
            nf_calories,
            nf_protein,
            nf_serving_size_unit,
            nf_total_carbohydrate,
            meal
        })
        .then(this.onResponseFromUpdateSubmit)
        .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <a onClick={this.toggle}>{this.props.buttonLabel}{this.props.inputVal}</a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{this.props.inputVal}</ModalHeader>
                    <ModalBody>
                        <div className={this.state.firstDisplay}>
                            <Row>
                                <Col>
                                    <strong>Calories:</strong>
                                </Col>
                                <Col>
                                    {Math.round(this.state.nf_calories)}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Quantity:</strong>
                                </Col>
                                <Col className="mt-1">
                                    {this.state.quantity} {this.state.nf_serving_size_unit}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Meal:</strong>
                                </Col>
                                <Col className="mt-1">
                                    {this.state.meal}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Protein:</strong>
                                </Col>
                                <Col className="mt-1">
                                    {Math.round(this.state.nf_protein)}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Total Carbs:</strong>
                                </Col>
                                <Col className="mt-1">
                                    {Math.round(this.state.nf_total_carbohydrate)}
                                </Col>
                            </Row>
                        </div>
                        <div className={this.state.secondDisplay}>
                            <Row>
                                <Col>
                                    <strong>Calories:</strong>
                                </Col>
                                <Col>
                                    <Input
                                        type="number"
                                        name="calories"
                                        id="caloriesNumber"
                                        className="form-control form-control-sm"
                                        value={Math.round(this.state.nf_calories)}
                                        onChange={e => this.setState({ nf_calories: e.target.value })}
                                    >
                                    </Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Quantity ({this.state.nf_serving_size_unit}):</strong>
                                </Col>
                                <Col>
                                    <Input
                                        type="number"
                                        name="quantity"
                                        id="quantityNumber"
                                        className="form-control form-control-sm"
                                        value={Math.round(this.state.quantity)}
                                        onChange={e => this.setState({ quantity: e.target.value })}
                                    >
                                    </Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Meal:</strong>
                                </Col>
                                <Col>
                                    <Input 
                                    type="select" 
                                    name="meal-select" 
                                    id="mealSelect" 
                                    className="form-control form-control-sm" 
                                    value={this.state.meal} 
                                    onChange={e => this.setState({ meal: e.target.value })}
                                    >
                                        <option>BreakFast</option>
                                        <option>Lunch</option>
                                        <option>Dinner</option>
                                        <option>Snack</option>
                                    </Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Protein:</strong>
                                </Col>
                                <Col>
                                    <Input
                                        type="number"
                                        name="protein"
                                        id="proteinNumber"
                                        className="form-control form-control-sm"
                                        value={Math.round(this.state.nf_protein)}
                                        onChange={e => this.setState({ nf_protein: e.target.value })}
                                    >
                                    </Input>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-1">
                                    <strong>Total Carbs:</strong>
                                </Col>
                                <Col>
                                    <Input
                                        type="number"
                                        name="totalCarbs"
                                        id="totalCarbsNumber"
                                        className="form-control form-control-sm"
                                        value={Math.round(this.state.nf_total_carbohydrate)}
                                        onChange={e => this.setState({ nf_total_carbohydrate: e.target.value })}
                                    >
                                    </Input>
                                </Col>
                            </Row>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className={this.state.firstDisplay}>
                            <Button color="primary" onClick={() => this.handleUpdateClick()}>Update</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Done</Button>
                        </div>
                        <div className={this.state.secondDisplay}>
                            <Button color="primary" onClick={() => this.handleUpdateSubmit()}>Submit</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}


export default UpdateModal;