import React from 'react';
import { Link } from "react-router-dom";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from 'reactstrap';
import AuthButton from "../AuthButton/AuthButton.js"
// import CalPal from "../CalPal/CalPal.js"
import "./Nav.css";


export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {

    let message = "";

    if (this.props.auth.isAuthenticated()) {
      const messages = [
        `Welcome, ${this.props.name}`,
        `You got this, ${this.props.name}`, 
        `You can do it, ${this.props.name}`, 
        `Slow And Steady Wins The Race, ${this.props.name}`, 
        `Like Your Money, Food Should Be Working For You, ${this.props.name}`, 
        `It’s Not A Diet, It’s A Lifestyle Change!`, 
        `Doubt Kills More Dreams Than Failure Ever Will`, 
        `Will Is A Skill, ${this.props.name}`, 
        `Stressed Spelled Backwards Is Desserts. Coincidence? I think not!`, 
        `Strive For Progress, Not Perfection`, `Success Is Never Certain, Failure Is Never Final`, 
        `A Goal Without A Plan Is Just A Wish, ${this.props.name}`, 
        `Success Is The Sum Of Small Efforts, Repeated Day In And Day Out`
      ];

      message = messages[(Math.floor(Math.random() * messages.length))];
    } else {

      message = "Your goals are just snaps away!"
    }

    if (this.props.auth.isAuthenticated()) {
      return (
        <div>
          <Navbar light>
            <NavbarBrand href="/" className="text-white">CalSnap</NavbarBrand>
            <div className="text-white message">{message}</div>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav navbar>
                <NavItem>
                  <Link to="/" className="btn text-white mr-3 mb-xs-3">Home</Link>
                </NavItem>
                <NavItem>
                  {/* <CalPal {...props}>CalBud</CalPal> */}
                  <Link to="/userprofile" className="btn text-white mr-3 mb-xs-3">Profile</Link>
                </NavItem>
                <NavItem>
                  <Link to="/about" className="btn text-white mr-3 mb-xs-3">About</Link>
                </NavItem>
                <NavItem>
                  <AuthButton {...this.props} />
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
    } else {
      return (
        <div>
          <Navbar light expand="md">
            <NavbarBrand href="/" className="text-white">CalSnap</NavbarBrand>
            <div className="text-white message">{message}</div>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav navbar className="ml-auto">
              <NavItem>
                  <AuthButton {...this.props} />
                </NavItem>
                <NavItem>
                  <Link to="/about" className="btn text-white mr-3 mb-xs-3">About</Link>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
      );
    }
  }
}