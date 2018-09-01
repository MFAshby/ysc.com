import { autorun } from 'mobx'
import { SecureStore } from 'expo'
import { AsyncStorage } from 'react-native'
import store from './Store'

const KEY_AUTH_TOKEN = 'net.mfashby.sailracetimerapp.jwt'
const KEY_RACE_ENTRIES = 'net.mfashby.sailracetimerapp.raceentries_'

SecureStore.getItemAsync(KEY_AUTH_TOKEN)
  .then(authToken => {
    store.authToken = authToken
  })
  .catch(e => console.log(e))

autorun(() => {
  SecureStore.setItemAsync(KEY_AUTH_TOKEN, store.authToken)
    .catch(e => console.log(e))
})

export async function getRaceEntries(raceId) {
  let resp = await AsyncStorage.getItem(`${KEY_RACE_ENTRIES}${raceId}`)
  return JSON.parse(resp)
}