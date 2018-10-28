import React, { Component } from "react";
import "./AuthButton.css";

class AuthButton extends Component {
    render() {
        const loggedIn = this.props.auth.isAuthenticated();
        if (loggedIn) {
            return (<button className="btn btn-primary" onClick={this.props.auth.logout}>Log Out</button>)
        } else {
            return (<button className="btn btn-primary" onClick={this.props.auth.login}>Log In</button>)
        }
    }
}

export default AuthButton;