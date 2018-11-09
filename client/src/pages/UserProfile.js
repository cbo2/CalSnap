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

    // This will delete users data
    updateUser = () => {
        API.updateUser(this.state.id, {calorieGoal: this.state.calorieGoal })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    // This will delete users data
    deleteFoodsbyUser = username => {
        API.deleteFoodsbyUser(username)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    deleteUser = (username, id) => {
        API.deleteFoodsbyUser(username, id)
            .then(res => {
                console.log(res)
                this.props.auth.logout();
            })
            .catch(err => console.log(err));
    };

    render() {
        const loggedIn = this.props.auth.isAuthenticated();
        if (loggedIn) {
            return (
                // <Link to="/">Home</Link>
                <Container>
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
                            <button className="btn btn-success mt-3" onClick={() => this.updateUser()}>Update</button>
                        </Col>

                    </Row>
                    <Row>
                        <button className="btn btn-danger mt-3" onClick={() => this.deleteFoodsbyUser(this.props.username)}>DELETE ALL DATA</button>
                    </Row>
                    <br></br>
                    <Row>
                        <button className="btn btn-danger" onClick={() => this.deleteUser(this.props.username, this.props.auth0UserId)}>DELETE ALL DATA AND PROFILE</button>
                    </Row>
                </Container>
            )
        } else {
            return (<Unauthorized></Unauthorized>)
        }
    }
};


export default UserProfile;