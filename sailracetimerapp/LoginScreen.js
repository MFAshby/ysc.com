import React, {Component} from "react"
import {ActivityIndicator, StatusBar, View} from "react-native"
import {Button, FormInput, FormLabel, FormValidationMessage} from "react-native-elements"

import {observer} from "mobx-react"
import {observable} from "mobx"

import store from "./Store"
import {API_ROOT} from "./Api"

@observer
export class LoginScreen extends Component {
  @observable username = ""
  @observable password = ""
  @observable loggingIn = false
  @observable loginError = ""

  _login = () => {
    this.loggingIn = true
    let body = JSON.stringify({
      name: this.username,
      password: this.password
    })

    console.log(body)
    fetch(`${API_ROOT}/login`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: body
    }).then(resp => {
      console.log(resp)
      if (!resp.ok) {
        throw new Error("Failed to log in")
      }
      return resp.text()
    }).then(text => {
      store.authToken = text
      this.loggingIn = false
    }).catch(err => {
      this.loginError = err.message
      this.loggingIn = false
    })
  }

  render() {
    return <View>
      <StatusBar hidden={true}/>
      <FormLabel>Username</FormLabel>
      <FormInput
        value={this.username}
        onChangeText={(text) => this.username = text}/>
      <FormLabel>Password</FormLabel>
      <FormInput
        value={this.password}
        onChangeText={(text) => this.password = text}
        secureTextEntry={true}/>
      <FormValidationMessage>{this.loginError}</FormValidationMessage>
      {this.loggingIn ?
        <ActivityIndicator animating={true}/> :
        <Button
          title="Log in"
          onPress={this._login}/>
      }
    </View>
  }
}