import React, { Component, createContext } from 'react'
import { withCookies } from 'react-cookie'

const LOGIN_COOKIE_NAME = "sailrace.logincookie"

export const LoginContext = createContext()

export function withLogin(WrappedComponent, opts) {
    const Wrapper = class extends Component {
        constructor(props) { 
            super(props) 
            this.state = {
                username: "",
                password: "",
                loginError: "",
                loggedIn: false,
                loggingIn: false,
                authToken: ""
            }
        }

        componentDidMount() {
            let {cookies} = this.props
            let loginCookie = cookies.get(LOGIN_COOKIE_NAME)
            if (loginCookie) {
                this.setState({loggedIn: true, authToken: loginCookie.id})
            }
        }

        loginClicked = async () => {
            this.setState({loggingIn: true, loginError: ""})
            let {username, password} = this.state
            let {cookies} = this.props
            try {
                let resp = await fetch(`${opts.loginUrl}`, {
                    method: "POST", 
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify({"username": username, "password": password})
                })
                if (resp.status === 401) {
                    this.setState({loginError: "Incorrect username or password"})
                }
                if (!resp.ok) {
                    throw resp
                }
                let jsn = await resp.json()
                cookies.set(LOGIN_COOKIE_NAME, jsn)
                this.setState({loggedIn: true})
            } catch (e) {
                console.log("error logging in")
                console.log(e)
            } finally {
                this.setState({loggingIn: false})
            }
        }

        logout = () => {
            this.setState({loggedIn: false})
            let {cookies} = this.props
            cookies.remove(LOGIN_COOKIE_NAME, null)
        }

        render() {
            let {username, password, loggedIn, loginError, loggingIn, authToken} = this.state
            if (loggedIn) {
                return <LoginContext.Provider value={{logout: this.logout, authToken: authToken}}>
                    <WrappedComponent {...this.props}/>
                </LoginContext.Provider> 
            }
            return <div>
                <input 
                    style={{display: 'block'}}
                    type="username" 
                    placeholder="username" 
                    value={username} 
                    onChange={ (evt) => this.setState({username: evt.target.value}) }></input>
                <input 
                    style={{display: 'block'}}
                    type="password" 
                    placeholder="password" 
                    value={password} 
                    onChange={ (evt) => this.setState({password: evt.target.value}) }></input>
                <button 
                    onClick={ this.loginClicked } 
                    disabled={!username || !password}>
                        Login
                </button>
                {
                    loggingIn && 
                    <p>Logging in...</p>
                }
                {
                    loginError && 
                    <p>{loginError}</p>
                }
            </div>
        }
    }
    return withCookies(Wrapper)
}