import { useEffect } from 'react'

function SEOHead({ title, description, article }) {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setOg = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    if (description) setMeta('description', description)
    if (article) {
      setOg('og:title', article.title)
      setOg('og:description', article.excerpt || description)
      setOg('og:type', 'article')
      setMeta('author', article.author)
    }
  }, [title, description, article])

  return null
}

export default SEOHead
