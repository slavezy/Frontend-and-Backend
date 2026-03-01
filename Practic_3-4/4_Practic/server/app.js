const express = require("express");
const { nanoid } = require("nanoid");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());

// CORS
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Логирование
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`
    );
    if (["POST", "PATCH"].includes(req.method)) {
      console.log("Body:", req.body);
    }
  });
  next();
});

// ===== 10+ товаров =====
let products = [
  { id: nanoid(6), title: "iPhone 15", category: "Смартфоны", description: "Apple смартфон", price: 120000, stock: 5 },
  { id: nanoid(6), title: "Samsung S24", category: "Смартфоны", description: "Samsung флагман", price: 110000, stock: 6 },
  { id: nanoid(6), title: "MacBook Air", category: "Ноутбуки", description: "Лёгкий ноутбук", price: 150000, stock: 3 },
  { id: nanoid(6), title: "ASUS ROG", category: "Ноутбуки", description: "Игровой ноутбук", price: 180000, stock: 2 },
  { id: nanoid(6), title: "AirPods Pro", category: "Аксессуары", description: "Наушники Apple", price: 25000, stock: 12 },
  { id: nanoid(6), title: "Sony XM5", category: "Аксессуары", description: "Премиум наушники", price: 30000, stock: 7 },
  { id: nanoid(6), title: "iPad Pro", category: "Планшеты", description: "Планшет Apple", price: 90000, stock: 4 },
  { id: nanoid(6), title: "Xiaomi Pad 6", category: "Планшеты", description: "Планшет Xiaomi", price: 40000, stock: 8 },
  { id: nanoid(6), title: "PlayStation 5", category: "Консоли", description: "Игровая приставка Sony", price: 70000, stock: 5 },
  { id: nanoid(6), title: "Xbox Series X", category: "Консоли", description: "Игровая приставка Microsoft", price: 65000, stock: 4 }
];

// Вспомогательная функция
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

// GET
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET by id
app.get("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

// POST
app.post("/api/products", (req, res) => {
  const { title, category, description, price, stock } = req.body;

  if (!title || !category || !description)
    return res.status(400).json({ error: "Invalid data" });

  const newProduct = {
    id: nanoid(6),
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH
app.patch("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  const { title, category, description, price, stock } = req.body;

  if (title !== undefined) product.title = title.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  res.json(product);
});

// DELETE
app.delete("/api/products/:id", (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists)
    return res.status(404).json({ error: "Product not found" });

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});