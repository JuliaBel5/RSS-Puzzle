export class LocalStorage {
  setItem(key: string, value: string) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  getItem(key: string) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  removeItem(key: string) {
    localStorage.removeItem(key)
  }

  clear() {
    localStorage.clear()
  }
}
