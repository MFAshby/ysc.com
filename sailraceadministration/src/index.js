import "babel-polyfill"
import React,  { Component } from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Link, Switch, NavLink} from 'react-router-dom'
import './index.css'

const API_SERVER = process.env.REACT_APP_API_SERVER

async function fetchJson(url) {
    let resp = await fetch(`${API_SERVER}/${url}`)
    if (!resp.ok) {
        throw resp
    }
    return await resp.json()
}

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
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            individuals: []
        }
    }

    async loadIndividuals() {
        this.setState({loading: true})
        let individuals = await fetchJson("individuals?filter[include]=boattype")
        this.setState({
            loading: false, 
            individuals: individuals
        })
    }

    componentDidMount() {
        this.loadIndividuals()
            .catch(e => console.log(e))
    }

    render() {
        let {loading, individuals} = this.state
        if (loading) {
            return <span>Loading...</span>
        }
        let individualRows = individuals.map(i => <tr>
            <td>{i.name}</td>
            <td>{i.boatnum}</td>
            <td>{i.boattype.btype}</td>
        </tr>)
        return <div>
            {
                individuals.length > 0 ? 
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Sail Number</th>
                        <th>Boat type</th>
                    </thead>
                    <tbody>
                        {individualRows}
                    </tbody>
                </table> : 
                <span>No individuals!</span>
            }
        </div>
    }
}

class Series extends Component {
    render() {
        return <span>Series</span>
    }
}

class BoatClasses extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return <span>Boat classes</span>
    }
}

ReactDOM.render(
    <HashRouter>
        <Main/>
    </HashRouter>
, document.getElementById('root'));
