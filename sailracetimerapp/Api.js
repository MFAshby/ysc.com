import store from './Store'
import {UNAUTHORIZED} from 'http-status-codes'

const API_ROOT = "https://ysc.nsupdate.info/api"

async function apicall({relativeURL, body, method = "GET"}) {
  let headers = {}
  if (body) {
    headers["Content-type"] ="application/json"
  }

  if (store.isAuth) {
    headers["Authorization"] =`Bearer ${store.authToken}`
  }

  let resp = await fetch(`${API_ROOT}${relativeURL}`, {
    body: body && JSON.stringify(body),
    headers: headers,
    method: method
  })

  if (resp.ok) {
    return await resp.json()
  } else {
    if (resp.status === UNAUTHORIZED) {
      store.authToken = ""
    }
    throw new Error(resp.statusText)
  }
}

export {
  API_ROOT,
  apicall
}