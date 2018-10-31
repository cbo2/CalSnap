import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import CalorieCount from "./pages/CalorieCount";
import Callback from "./pages/Callback";
import NoMatch from "./pages/NoMatch.js";
import './App.css';

const App = (props) => (
  <Router>
    <div>
      <Nav {...props}/>
      <Switch>
        <Route exact path="/" render={() => <CalorieCount {...props} />} />
        <Route path="/callback" render={() => <Callback {...props} />} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default App;
