import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="productRow">
      <div>
        <b>{product.title}</b> ({product.category})
        <div>{product.description}</div>
        <div>Цена: {product.price} ₽</div>
        <div>На складе: {product.stock}</div>
      </div>
      <div>
        <button onClick={() => onEdit(product)}>Редактировать</button>
        <button onClick={() => onDelete(product.id)}>Удалить</button>
      </div>
    </div>
  );
}