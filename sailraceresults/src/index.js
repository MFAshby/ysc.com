import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
let apiServer = window.location.origin + '/api';
console.log("Environment " + process.env.NODE_ENV);
console.log("API server is " + apiServer);
ReactDOM.render(<App apiServer={apiServer}/>, document.getElementById('root'));
