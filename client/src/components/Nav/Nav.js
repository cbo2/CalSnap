import React from "react";
import AuthButton from "../AuthButton/AuthButton.js"
import "./Nav.css";

const Nav = (props) => (
      <div className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="/">CalSnap</a>
        <AuthButton {...props}/>
      </div>
)

export default Nav;
