import React from "react";
import { Button, Modal, Row, Col, Container, Progress, Jumbotron, Card, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import "./Caldisplay.css";

class Caldisplay extends React.Component {



  render() {

    
    return (

        
        <Row className="row cal-display">
          <Col xs="4">
            <div className="cal-title">Goal:</div>
            <div className="cal-tile" id="cal-goal"><b>{this.props.dailyGoal}</b></div>
          </Col>
          <Col xs="4" className="cal">
            <div className="cal-title">Consumed:</div>
            <div className="cal-tile" id="cal-actual"><b>{this.props.actual}</b></div>
          </Col>
          <Col xs="4">
            <div className="cal-title">Remaining: </div>
            <div className="cal-tile" id={this.props.remainingStatus}><b>{this.props.remaining}</b></div>
          </Col>
        </Row>

   

    )

  }
}

export default Caldisplay;