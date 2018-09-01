import React, {Component} from 'react'
import {View, FlatList, SafeAreaView} from 'react-native'
import {Icon, ListItem} from 'react-native-elements'
import {FloatingAction} from 'react-native-floating-action'

import {observable} from "mobx"
import {observer} from "mobx-react"

import { getRaceEntries } from './LocalPersistence'
import * as Alert from "react-native/Libraries/Alert/Alert"

@observer
export class PrepareRaceScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('race', {}).name,
    };
  };

  @observable loading = false
  @observable entries = []

  componentDidMount() {
    this._getEntries()
  }

  _getEntries = () => {
    this.loading = true
    let { navigation }= this.props
    let raceId = navigation.getParam('race', {}).id
    getRaceEntries(raceId)
      .then(entries => this.entries = entries)
      .catch(err => console.log(err))
  }

  _renderItem = ({item}) => {
    return <ListItem/>
  }

  render() {
    // return <View>
    //   <FlatList
    //     data={this.entries}
    //     renderItem={this._renderItem}
    //     keyExtractor={item => item.id}
    //     refreshing={this.loading}
    //     onRefresh={this._getEntries}/>
    //   <FloatingAction
    //     actions={[{icon: <Icon name="add"/>, name: "test"}]}
    //     onPressItem={(item) => console.log(item)}/>
    // </View>
    const actions = [{
      text: 'Accessibility',
      icon: <Icon name="add"/>,
      name: 'bt_accessibility',
      position: 2
    }, {
      text: 'Language',
      icon: <Icon name="add"/>,
      name: 'bt_language',
      position: 1
    }, {
      text: 'Location',
      icon: <Icon name="add"/>,
      name: 'bt_room',
      position: 3
    }, {
      text: 'Video',
      icon: <Icon name="add"/>,
      name: 'bt_videocam',
      position: 4
    }];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Property
            propertyName="position"
            propertyValue="right"
            defaultValue="right"
          />
          <FloatingAction
            actions={actions}
            position="right"
            onPressItem={
              (name) => {
                Alert.alert('Icon pressed', `the icon ${name} was pressed`);
              }
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}