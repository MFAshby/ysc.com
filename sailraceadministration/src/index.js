import React,  { Component } from 'react'
import ReactDOM from 'react-dom'
import {Admin} from 'react-admin'
import loopbackRestClient, {authClient} from 'aor-loopback'
const API_SERVER = process.env.NODE_ENV === 'development' ? 
            'http://localhost:8080/api' :
            window.location.origin + '/api';

ReactDOM.render(
    <Admin
        dataProvider={loopbackRestClient(API_SERVER)}
        authProvider={authClient(API_SERVER + '/Users/login')}>
    </Admin>
, document.getElementById('root'));
