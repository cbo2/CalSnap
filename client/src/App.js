import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import CalorieCount from "./pages/CalorieCount";
import Callback from "./pages/Callback";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About"
import NoMatch from "./pages/NoMatch";
import './App.css';

const App = (props) => (
  <Router>
    <div>
      <Nav {...props}/>
      <Switch>
        <Route exact path="/" render={() => <CalorieCount {...props} />} />
        <Route path="/callback" render={() => <Callback {...props} />} />
        <Route path="/userprofile" render={() => <UserProfile {...props} />} />
        <Route path="/about" render={() => <About />} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default App;
