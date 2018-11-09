import React, { Component } from "react";
import { Container, Row, Col, Input } from 'reactstrap';
// import { Link } from "react-router-dom";
import Unauthorized from "./Unauthorized";
import API from "../utils/API";

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            calorieGoal: 0
        }
    }

    componentDidMount() {
        API.getUser({ username: this.props.username })
            .then(res => {
                console.log(`got the user's id as: ${res.data._id} and calorieGoal: ${JSON.stringify(res.data)}`)
                this.setState({ id: res.data._id, calorieGoal: res.data.calorieGoal })
            })
            .catch(err => {
                console.log(`ERROR on call to API.getUser for user: ${this.props.username}`)
            })
    }

    // This will update users data
    updateUser = () => {
        API.updateUser(this.state.id, { calorieGoal: this.state.calorieGoal })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    // This will delete users data
    deleteFoodsbyUser = username => {
        API.deleteFoodsbyUser(username)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    // This will delete user completely
    deleteUser = (username, id) => {
        API.deleteUser(username, id)
            .then(res => {
                console.log(res)
                this.props.auth.logout();
            })
            .catch(err => console.log(err));
    };
    // <img src={this.props.profileImage} alt={this.props.name} className="img-fluid h-50"></img>
    render() {
        const loggedIn = this.props.auth.isAuthenticated();
        if (loggedIn) {
            return (
                <Container className="mt-3">
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <strong>Name:</strong>
                                </Col>
                                <Col>
                                    {this.props.name}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Username:</strong>
                                </Col>
                                <Col>
                                    {this.props.username}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Daily Calorie Goal:</strong>
                                </Col>
                                <Col>
                                    <Input
                                        type="number"
                                        name="caloriegoal"
                                        id="calorieGoal"
                                        className="form-control form-control-sm"
                                        value={this.state.calorieGoal}
                                        onChange={e => this.setState({ calorieGoal: e.target.value })}
                                    >
                                    </Input>
                                </Col>
                                <Col>
                                    <button className="btn btn-success" onClick={() => this.updateUser()}>Update</button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Container className="border border-dark mt-3">
                        <Row className="mt-3">
                            <Col>
                                <strong>Danger Zone</strong>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Row>
                                    <Col xl="12" className="mt-3">
                                        This button will delete ALL of your data!
                                    </Col>
                                    <Col xl="12">
                                        <button className="btn btn-danger" onClick={() => this.deleteFoodsbyUser(this.props.username)}>DELETE ALL DATA</button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl="12" className="mt-3">
                                This button will delete ALL of your data and your profile!
                            </Col>
                            <Col xl="12" className="mb-3">
                                <button className="btn btn-danger" onClick={() => this.deleteUser(this.props.username, this.props.auth0UserId)}>DELETE ALL DATA AND PROFILE</button>
                            </Col>
                        </Row>

                    </Container>

                </Container>
            )
        } else {
            return (<Unauthorized></Unauthorized>)
        }
    }
};


export default UserProfile;