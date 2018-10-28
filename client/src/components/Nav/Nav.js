import React from "react";
import AuthButton from "../AuthButton"

const Nav = (props) => (
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <a className="navbar-brand" href="/">CalSnap</a>
        <AuthButton {...props}/>
      </nav>
)

export default Nav;
