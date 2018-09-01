import React, { Component } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import store from './Store'

export class Settings extends Component {
  _logout = () => {
    store.authToken = ""
  }

  render() {
    return <View><Button title="Log out" onPress={this._logout}/></View>
  }
}