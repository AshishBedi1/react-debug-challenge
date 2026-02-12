function ImageGallery({ images, productName }) {
  return (
    <div className="image-gallery">
      <h4>{productName} Gallery</h4>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <img
            key={`${productName}-${index}`}
            src={src}
            alt={`${productName} image ${index + 1}`}
            className="gallery-img"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
