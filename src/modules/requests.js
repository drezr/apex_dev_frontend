class Requests {
  constructor() {
    this.http = null
  }

  get(url) {
    return new Promise(resolve => {
      this.http.get(url, {}, (s, result) => resolve(result))
    })
  }
}

export default new Requests