import React, { Component } from "react";
import { Container, Row } from 'reactstrap';
// import { Link } from "react-router-dom";
import Unauthorized from "./Unauthorized";
import API from "../utils/API";

class UserProfile extends Component {

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