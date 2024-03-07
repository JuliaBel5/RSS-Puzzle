export class LocalStorage {
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  getItem(key) {
    let data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  removeItem(key) {
    localStorage.removeItem(key)
  }

  clear() {
    localStorage.clear()
  }
}
