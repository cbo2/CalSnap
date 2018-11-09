import React from "react";
import "./LaunchPage.css";
import { Link } from "react-router-dom";
import { Jumbotron, Row, Col, Container } from 'reactstrap';

class LaunchPage extends React.Component {


    render() {
        return (
        <div>
            <Jumbotron fluid>
                <Container>
                    <Row>
                        <Col xs="12">
                            <h1>Welcome to CalSnap</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <Link to="" className="launch-page-login"><h2 onClick={this.props.auth.login}>Log in to get started</h2></Link>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
        </div>
        )
    }
};

export default LaunchPage;