import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CalorieCount from "./pages/CalorieCount";
import LoggedIn from "./pages/LoggedIn";
import './App.css';

const App = (props) => (
  <Router>
    <div>
      <Switch>
        <Route  exact path="/" render={() => <CalorieCount {...props} />} />
        <Route  exact path="/loggedin" render={() => <LoggedIn {...props} />} />
      </Switch>
    </div>
  </Router>
);

export default App;
