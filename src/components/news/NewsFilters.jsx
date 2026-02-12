const categories = ['All', 'Technology', 'Science', 'Business', 'Health', 'Sports']

function NewsFilters({ selectedCategory, onCategoryChange }) {
  return (
    <div className="news-filters">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`news-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default NewsFilters
