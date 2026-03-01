import React from "react";
import ProductItem from "./ProductItem";

export default function ProductsList({ products, onEdit, onDelete }) {
  if (!products.length) return <div>Нет товаров</div>;

  return (
    <div>
      {products.map(p => (
        <ProductItem
          key={p.id}
          product={p}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}