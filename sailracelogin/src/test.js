import React, { createElement, Component } from 'react'
import ReactDOM  from 'react-dom'
import { withLogin, LoginContext } from './index'
import "babel-polyfill"

class Thing extends Component {
    render() {
        return (
            <LoginContext.Consumer>
                {({logout, authToken}) => <div>Hello, your auth token is {authToken} <button onClick={logout}>Logout</button></div>}
            </LoginContext.Consumer>
            
        )
    }
}

ReactDOM.render(
    createElement(withLogin(Thing, {loginUrl: "http://localhost:8080/api/MyUsers/login"})), 
    document.getElementById('login-root')
)


