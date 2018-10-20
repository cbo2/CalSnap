import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CalorieCount from "./pages/CalorieCount";
import './App.css';

const App = () => (
  <Router>
    <div>
      {/* <Nav /> */}
      <Switch>
        <Route exact path="/" component={CalorieCount} />
      </Switch>
    </div>
  </Router>
);

export default App;
