import React from "react";
import "./LaunchPage.css";
import { Jumbotron, Row, Col, Container } from 'reactstrap';

const LaunchPage = props => (
    // table hard-coded as placeholder. Will map through results in future version
    
        <Jumbotron fluid>
            <Container>
                <Row>
                    <Col xs="12">
                    <h1>Welcome to CalSnap</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                    <h2>Log in to get started</h2>
                    </Col>     
                </Row>
            </Container>
        </Jumbotron>
   

);

export default LaunchPage;