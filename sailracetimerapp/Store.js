import {computed, observable} from "mobx"

class Store {
  @observable authToken = ""

  @computed get isAuth() {
    return this.authToken !== ""
  }
}
const store = new Store()
export default store
