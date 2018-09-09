import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
ReactDOM.render(<App apiServer={process.env.REACT_APP_API_SERVER}/>, document.getElementById('root'));
