const express = require("express");
const { nanoid } = require("nanoid");
const cors = require("cors");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

app.use(express.json());

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

// ===== PRODUCTS =====
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

// ===== SWAGGER =====
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "API управления товарами"
    },
    servers: [
      {
        url: `http://localhost:${port}`
      }
    ]
  },
  apis: ["./app.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 *       example:
 *         id: "abc123"
 *         title: "iPhone 15"
 *         category: "Смартфоны"
 *         description: "Apple смартфон"
 *         price: 120000
 *         stock: 5
 */

function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в данных
 */
app.get("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Обновленный товар
 *       404:
 *         description: Товар не найден
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 */
app.delete("/api/products/:id", (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists)
    return res.status(404).json({ error: "Product not found" });

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
  console.log(`Swagger available at http://localhost:${port}/api-docs`);
});