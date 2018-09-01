import React, {Component} from 'react'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  NavigationActions
} from 'react-navigation'
import {LoginScreen} from "./LoginScreen"
import {RaceListScreen} from "./RaceListScreen"
import {IndividualsScreen} from "./IndividualsScreen"
import {Settings}from "./Settings"

import { observable, autorun } from 'mobx'
import store from './Store'
import './LocalPersistence'
import {PrepareRaceScreen} from "./PrepareRaceScreen"

const RaceStack = createStackNavigator({
  RaceListScreen: RaceListScreen,
  PrepareRaceScreen: PrepareRaceScreen
}, {
  initialRouteName: "RaceListScreen"
})

const MainTabs = createBottomTabNavigator({
  RaceStack: {screen: RaceStack, navigationOptions: {title: "Races"}},
  IndividualsScreen:IndividualsScreen,
  Settings: Settings
}, {
  initialRouteName: "RaceStack"
})

const LoginNav = createSwitchNavigator({
  LoginScreen: LoginScreen,
  MainTabs: MainTabs
}, {
  initialRouteName: "LoginScreen"
})

export default class App extends Component {
  @observable loginNavRef = null

  componentDidMount() {
    this.dispose = autorun(() => {
      let routeName = store.isAuth ? "MainTabs" : "LoginScreen"
      if (this.loginNavRef) {
        this.loginNavRef.dispatch(NavigationActions.navigate({routeName: routeName}))
      }
    })
  }

  componentWillUnmount() {
    this.dispose()
    this.dispose = null
  }
  render() {
    return <LoginNav ref={ref => this.loginNavRef = ref}/>
  }
}