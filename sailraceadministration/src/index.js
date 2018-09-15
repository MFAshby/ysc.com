import React,  { Component } from 'react'
import ReactDOM from 'react-dom'
import {Admin} from 'react-admin'
import loopbackRestClient, {authClient} from 'aor-loopback'
const API_SERVER = process.env.REACT_APP_API_SERVER


ReactDOM.render(
    <Admin
        dataProvider={loopbackRestClient(API_SERVER)}
        authProvider={authClient(API_SERVER + '/Users/login')}>
    </Admin>
, document.getElementById('root'));
