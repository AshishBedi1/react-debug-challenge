class DataCache {
  constructor() {
    this.cache = new Map()
    this.ttl = 60000 // 1 minute
  }

  _getKey(url) {
    return url // Use the full URL including query params
  }

  get(url) {
    const key = this._getKey(url)
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    return entry.data
  }

  set(url, data) {
    const key = this._getKey(url)
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clear() {
    this.cache.clear()
  }
}

export const dataCache = new DataCache()
