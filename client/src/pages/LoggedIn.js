import React, { Component } from "react";
import { Jumbotron } from "reactstrap";

class LoggedIn extends Component {

    render(props) {
        return (
            <Jumbotron {...props}>
                <div>
                    <img src={this.props.profileImage} alt={this.props.name}></img>
                    This is the super secret area!  Welcome, {this.props.name}!
                </div>
            </Jumbotron>
        );
    }
};


export default LoggedIn;
