import React, { useEffect, useState } from "react";

export default function ProductModal({ open, initial, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    stock: ""
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input placeholder="Название"
          value={form.title}
          onChange={e => setForm({...form, title:e.target.value})}/>
        <input placeholder="Категория"
          value={form.category}
          onChange={e => setForm({...form, category:e.target.value})}/>
        <input placeholder="Описание"
          value={form.description}
          onChange={e => setForm({...form, description:e.target.value})}/>
        <input placeholder="Цена"
          value={form.price}
          onChange={e => setForm({...form, price:e.target.value})}/>
        <input placeholder="Количество"
          value={form.stock}
          onChange={e => setForm({...form, stock:e.target.value})}/>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </form>
    </div>
  );
}