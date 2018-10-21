import React from "react";
import "./SnapFoodButton.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
const SnapFoodBtn = props => (
  <button type="button" className="btn btn-info" {...props}>Snap Food!</button>
);

export default SnapFoodBtn;
