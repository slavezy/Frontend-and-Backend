import React, { useEffect, useState } from "react";
import ProductsList from "../../components/ProductsList";
import ProductModal from "../../components/ProductModal";
import { api } from "../../api";
import "./ProductsPage.scss";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  const remove = async (id) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const save = async (form) => {
    if (editing) {
      const updated = await api.updateProduct(editing.id, form);
      setProducts(prev => prev.map(p => p.id === editing.id ? updated : p));
    } else {
      const created = await api.createProduct(form);
      setProducts(prev => [...prev, created]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="page">
      <h1>Интернет-магазин</h1>
      <button onClick={() => setModalOpen(true)}>Добавить товар</button>

      <ProductsList
        products={products}
        onEdit={(p)=>{setEditing(p);setModalOpen(true)}}
        onDelete={remove}
      />

      <ProductModal
        open={modalOpen}
        initial={editing}
        onClose={()=>{setModalOpen(false);setEditing(null)}}
        onSubmit={save}
      />
    </div>
  );
}