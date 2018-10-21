import React from "react";
import "./Caldisplay.css";

const Caldisplay = props => (
 
    <div className="row cal-display">
      <div className="col-12 col-md-4 cal-goal">Daily Goal: <br></br><b>{props.dailyGoal}</b></div>  
      <div className="col-12 col-md-4 cal-actual">Today's Actual: <br></br><b>{props.actual}</b></div>  
      <div className="col-12 col-md-4 cal-remaining">Remaining: <br></br><b>{props.remaining}</b></div>  
    </div>
  
);

export default Caldisplay;