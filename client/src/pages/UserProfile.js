import React, { Component } from "react";
import { Container, Row } from 'reactstrap';
// import { Link } from "react-router-dom";
import NoMatch from "./NoMatch.js";
import API from "../utils/API";

class UserProfile extends Component {

    // This will delete users data
    deleteFoodsbyUser = username => {
        API.deleteFoodsbyUser(username)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    render() {
        const loggedIn = this.props.auth.isAuthenticated();
        if (loggedIn) {
            return (
                // <Link to="/">Home</Link>
                <Container>
                    <Row>
                        <button className="btn btn-danger" onClick={() => this.deleteFoodsbyUser(this.props.username)}>DELETE ALL DATA</button>
                    </Row>
                    <br></br>
                    <Row>
                        <button className="btn btn-danger">DELETE ALL DATA AND PROFILE</button>
                    </Row>
                </Container>
            )
        } else {
            return (<NoMatch></NoMatch>)
        }
    }
};


export default UserProfile;