class FetchCache {
  constructor() {
    this.store = new Map()
    this.ttl = 60000 // 1 minute
  }

  get(url) {
    const entry = this.store.get(url)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(url)
      return null
    }
    return entry.data
  }

  set(url, data) {
    this.store.set(url, { data, timestamp: Date.now() })
  }

  has(url) {
    return this.store.has(url)
  }

  clear() {
    this.store.clear()
  }
}

export const fetchCache = new FetchCache()
