import axios from 'axios'

let local_backend = true

// Force local_backend to be false if host is 'apex.wf'
if (window.location.host == 'apex.wf' || window.location.host == 'mobile.apex.wf') {
  local_backend = false
}

class Http {
  constructor() {
    this.header = null
    this.local = local_backend
    this.site = this.local ? 'http://127.0.0.1:8080/' : 'https://apex.wf/'
    this.api = this.local ? 'http://127.0.0.1:8000/' : 'https://api.apex.wf/'
    this.ws = this.local ? 'ws://127.0.0.1:8000/ws/' : 'wss://api.apex.wf/ws/'
    this.media = this.local ? 'http://127.0.0.1:8888/' : 'https://media.apex.wf/'
  }

  _get(path, params, callback) {
    axios({
      method: 'get',
      headers: this.header,
      url: this.api + path,
      params: params,
    }).then((response) => {
      callback(response.status, response.data)
    }).catch((error) => {
      console.error(error)

      if (error.response) {
        console.error(error.response.status)
        console.error(error.response.data)
        console.error(error.response.headers)
        callback(error.response.status, error.response.data)
      }
    })
  }

  _post(path, data, callback) {
    axios({
      method: 'post',
      headers: this.header,
      url: this.api + path,
      data: data,
    }).then((response) => {
      callback(response.status, response.data)
    }).catch((error) => {
      console.error(error)

      if (error.response) {
        console.error(error.response.status)
        console.error(error.response.data)
        console.error(error.response.headers)
        callback(error.response.status, error.response.data)
      }
    })
  }

  _put(path, data, callback) {
    axios({
      method: 'put',
      headers: this.header,
      url: this.api + path,
      data: data,
    }).then((response) => {
      callback(response.status, response.data)
    }).catch((error) => {
      console.error(error)

      if (error.response) {
        console.error(error.response.status)
        console.error(error.response.data)
        console.error(error.response.headers)
        callback(error.response.status, error.response.data)
      }
    })
  }

  _patch(path, data, callback) {
    axios({
      method: 'patch',
      headers: this.header,
      url: this.api + path,
      data: data,
    }).then((response) => {
      callback(response.status, response.data)
    }).catch((error) => {
      console.error(error)

      if (error.response) {
        console.error(error.response.status)
        console.error(error.response.data)
        console.error(error.response.headers)
        callback(error.response.status, error.response.data)
      }
    })
  }

  _delete(path, callback) {
    axios({
      method: 'delete',
      headers: this.header,
      url: this.api + path,
    }).then((response) => {
      callback(response.status, response.data)
    }).catch((error) => {
      console.error(error)

      if (error.response) {
        console.error(error.response.status)
        console.error(error.response.data)
        console.error(error.response.headers)
        callback(error.response.status, error.response.data)
      }
    })
  }

  get(url, params) {
    return new Promise(resolve => {
      this._get(url, params, (s, result) => resolve(result))
    })
  }

  filter(url, params) {
    return new Promise(resolve => {
      this.get(url, params, (s, result) => resolve(result))
    })
  }

  post(url, data) {
    return new Promise(resolve => {
      this._post(url, data, (s, result) => resolve(result))
    })
  }

  put(url, data) {
    return new Promise(resolve => {
      this._put(url, data, (s, result) => resolve(result))
    })
  }

  patch(url, data) {
    return new Promise(resolve => {
      this._patch(url, data, (s, result) => resolve(result))
    })
  }

  delete(url) {
    return new Promise(resolve => {
      this._delete(url, (s, result) => resolve(result))
    })
  }
}

export default new Http