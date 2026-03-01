import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json"
  }
});

export const api = {
  getProducts: async () => (await apiClient.get("/products")).data,
  createProduct: async (data) => (await apiClient.post("/products", data)).data,
  updateProduct: async (id, data) => (await apiClient.patch(`/products/${id}`, data)).data,
  deleteProduct: async (id) => (await apiClient.delete(`/products/${id}`)).data,
};