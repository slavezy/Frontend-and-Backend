const express = require('express');
const app = express();
const port = 3000;

let users = [
  { id: 1, name: 'App store', price: 145000000},
  { id: 2, name: 'BMW', price: 86000000},
  { id: 3, name: 'Mersedes', price: 932095600},
];


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Главная страница');
});


app.post('/users', (req, res) => {
  const { name, price } = req.body;
  const newUser = {
    id: Date.now(),
    name,
    price
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('Пользователь не найден');
  }
});


app.patch('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).send('Пользователь не найден');
  }

  const { name, price } = req.body;
  if (name !== undefined) user.name = name;
  if (price !== undefined) user.price = price   ;

  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.send('Ok');
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});