import React from "react";
import AuthButton from "../AuthButton/AuthButton.js"
// import CalPal from "../CalPal/CalPal.js"
import "./Nav.css";

const Nav = (props) => (
      <div className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="/">CalSnap</a>
        <AuthButton {...props}/>
        {/* <CalPal {...props}>CalBud</CalPal> */}
      </div>
)

export default Nav;
