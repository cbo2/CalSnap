import React, { Component } from "react";

class Nav extends Component {
  render(props) {
    const loggedIn = this.props.auth.isAuthenticated();

    if (loggedIn)
      return (
        <nav {...props} className="navbar navbar-expand-lg navbar-light bg-primary">
          <a className="navbar-brand" href="/">CalSnap</a>
          <button className="btn btn-primary" onClick={this.props.auth.logout}>Log Out</button>
        </nav>
      )
    return (
      <nav {...props} className="navbar navbar-expand-lg navbar-light bg-primary">
        <a className="navbar-brand" href="/">CalSnap</a>
        <button className="btn btn-primary" onClick={this.props.auth.login}>Log In</button>
      </nav>
    )
  };
}

export default Nav;
