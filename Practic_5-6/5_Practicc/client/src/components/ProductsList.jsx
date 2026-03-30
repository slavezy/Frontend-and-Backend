import React from 'react';
import './ProductsList.css';

export default function ProductsList({ products, onEdit, onDelete }) {
  // Обработчик ошибок загрузки изображений
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  };

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img 
              src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
              alt={product.title}
              onError={handleImageError}
            />
          </div>
          <div className="product-info">
            <h3>{product.title}</h3>
            <p className="category">{product.category}</p>
            <p className="description">{product.description}</p>
            <p className="price">{product.price} ₽</p>
            <p className="stock">В наличии: {product.stock}</p>
            <div className="buttons">
              <button onClick={() => onEdit(product)}>✏️ Редактировать</button>
              <button onClick={() => onDelete(product.id)}>🗑️ Удалить</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}