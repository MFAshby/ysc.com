import "babel-polyfill"
import React,  { Component } from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Link, Switch, NavLink} from 'react-router-dom'
import './index.css'

const API_SERVER = process.env.REACT_APP_API_SERVER

class Main extends Component {
    render() {
        return <div>
            <Nav/>
            <Switch>
                <Route exact path='/' component={Home}></Route>
                <Route path='/individuals' component={Individuals}></Route>
                <Route path='/series' component={Series}></Route>
                <Route path='/boatclasses' component={BoatClasses}></Route>
            </Switch>
        </div>
    }
}

class Nav extends Component {
    render() {
        
        return <ul>
            <NavLink to={`/`}>Home</NavLink> 
            <NavLink to={`/individuals`}>Individuals</NavLink> 
            <NavLink to={`/series`}>Series</NavLink> 
            <NavLink to={`/boatClasses`}>Boat classes</NavLink> 
        </ul>
    }
}

class Home extends Component {
    render() {
        return <span>Home</span>
    }
}

class Individuals extends Component {
    render() {
        return <span>Individuals</span>
    }
}

class Series extends Component {
    render() {
        return <span>Series</span>
    }
}

class BoatClasses extends Component {
    render() {
        return <span>Boat classes</span>
    }
}

ReactDOM.render(
    <HashRouter>
        <Main/>
    </HashRouter>
, document.getElementById('root'));
