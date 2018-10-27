import React, { Component } from "react";
import Auth from "../Auth";
// import { Input, FormBtn } from "../../components/Form";

export default class Callback extends Component {

  componentDidMount() {
    const auth = new Auth();
    auth.handleAuthentication();
  }

  render(props) {
    return (
      <div {...props}>Loading...</div>
    )};
}