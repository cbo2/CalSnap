import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Auth from "./Auth"
import * as serviceWorker from './serviceWorker';

const auth = new Auth();

let state = {}

window.setState = (changes) => {
    state = Object.assign({}, state, changes);

    ReactDOM.render(<App {...state} />, document.getElementById('root'));
}

let username = "friend";
let profileImage = "";

if (auth.isAuthenticated()) {
    username = auth.getProfile().given_name || auth.getProfile()["https://calsnap.herokuapp.com/user_metadata"].given_name || "friend";
    profileImage = auth.getProfile().picture || "";
}

let initialState = {
    name: username,
    profileImage,
    auth
}

window.setState(initialState);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
