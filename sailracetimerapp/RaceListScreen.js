import React, {Component} from "react"
import {StatusBar, View, FlatList, Text} from "react-native"
import {ListItem} from 'react-native-elements'

import {observable} from "mobx"
import {observer} from "mobx-react"

import {apicall} from "./Api"

@observer
export class RaceListScreen extends Component {
  static navigationOptions = {
    title: "Races"
  }

  @observable loading = false
  @observable unfinishedRaces = []

  componentDidMount() {
    this._loadUnfinishedRaces()
  }

  _loadUnfinishedRaces = () => {
    this.loading = true
    apicall({relativeURL: "/race?finished=false&sort=rdate&limit=10"})
      .then(races => this.unfinishedRaces = races)
      .catch(e => console.log(e))
      .finally(() => this.loading = false)
  }

  _renderItem = ({item}) => {
    let {navigation} = this.props
    return <ListItem
      title={item.name}
      onPress={() => navigation.navigate('PrepareRaceScreen', {race: item})}/>
  }

  render() {
    return <View>
      <FlatList
        data={this.unfinishedRaces}
        renderItem={this._renderItem}
        keyExtractor={item => `${item.id}`}
        refreshing={this.loading}
        onRefresh={this._loadUnfinishedRaces}/>
    </View>
  }
}