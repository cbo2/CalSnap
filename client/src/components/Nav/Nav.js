import React, { Component } from "react";
// import { Input, FormBtn } from "../../components/Form";

class Nav extends Component {
  render(props) {
    return (
      <nav {...props} className="navbar navbar-expand-lg navbar-light bg-primary">
        <a className="navbar-brand" href="/">CalSnap</a>
        
        { this.props.auth.isAuthenticated()
        ? <button className="btn btn-primary" onClick={this.props.auth.login}>Log In</button>
        : <button className="btn btn-primary" onClick={this.props.auth.logout}>Log Out</button>
      }
      </nav>
    )};
}

export default Nav;
