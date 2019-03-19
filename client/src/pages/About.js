import React from "react";
import { Container, Row, Col } from 'reactstrap';
import "./About.css";
import photo from "../pages/assets/logo-01.png"
import tech from "../pages/assets/tech.png"
import nutritionixLogo from "../pages/assets/NutritionixAPI.png"

const About = () => (

  <div>
    <Container>
      <Row>
        <Col>
          <img src={photo} alt="CalSnap" className="logo-photo"></img>
        </Col>
      </Row>

      <p>Calsnap is a caloric tracking app developed to assist health conscious users understand
         the caloric value of foods they have consumed or plan to consume. With customizable goals,
         reactive caloric tracking and integrated technologies, tracking what you eat is now as easy as a Snap.
         Powered by IBM’s Watson in conjunction with Nutritionix’s nutritional database, CalSnap’s user friendly
         search capabilities eliminates the laborious process of searching through endless list of foods and
         drop-down menus to accurately track what one is eating.</p>

      <p>Simple. Clean. Easy. Just like eating needs to be.</p>

      <b>Search Modes</b>
      <ul>
        <li>Natural Language search bar</li>
        <li>Barcode scanning</li>
        <li>Image capture powered by IBM’s Watson</li>
      </ul>
      <b>Highlights and Key Functionalities</b>
      <ul>
        <li>Multi-option search capability</li>
        <li>Historic record of daily consumption</li>
        <li>Customizable goals</li>
        <li>Dynamic daily progress bar</li>
      </ul>

      <b>Development Team</b>
      <ul>
        <li>Craig "CBO" Bomba</li>
        <li>Joshua Gallaway</li>
        <li>Justin Gerow</li>
        <li>Don Vincent</li>
      </ul>
      <Row>
        <Col>
          <img src={tech} alt="CalSnap" className="tech-photo"></img>
        </Col>
      </Row>
      <Row>
        <Col>
          <img src={nutritionixLogo} alt="Nutritionix" className="nutritionixAPI"></img>
        </Col>
      </Row>

    </Container>
  </div>
);

export default About;