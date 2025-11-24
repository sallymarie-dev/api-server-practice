import express from "express";
const app = express();
const PORT = 3000;
import { randomUUID } from "node:crypto";
app.use(express.json());

const snacksStorage = [
  { id: 1, name: "cheezit", price: 4.99, tags: ["crackers", "cheese snack"] },
  { id: 2, name: "Pringles", price: 2.49, tags: ["potato", "flavored crisp"] },
  { id: 3, name: "cakes", price: 4.49, tags: ["debbie cakes", "iced buns"] },
];
app.get("/snacks/:id", (req, res) => {
  const { id } = req.params;
  const snack = snacksStorage.find((snack) => snack.id === id);
  if (!snack) {
    return res.status(404).json({ error: "Snack not found" });
  }
  res.json(snack);
});
app.get("/snacks", (req, res) => {
  res.json({
    snacks: snacksStorage,
  });
});
app.post("/snacks", (req, res) => {
  const { name, price } = req.body;

  if (!req.body?.name) {
    return res.status(400).json({ error: "Snack name is required" });
  }

  if (!req.body?.price && req.body?.price !== 0) {
    return res.status(400).json({ error: "Snack price is required" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ error: "Price must be a number" });
  }

  const newSnack = {
    id: randomUUID(),
    name,
    price,
  };

  snacksStorage.push(newSnack);
  res.status(201).json(newSnack);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello, express!</h1>");
});

app.get("/my-dog", (req, res) => {
  res.json({
    name: "Maru",
    age: 7,
    hobbies: ["sleeping", "playing"],
  });
});

app.get("/fruits", (req, res) => {
  res.json({
    name: "apple",
    shelf: "on week",
    color: "various",
  });
});

app.get("/favorite", (req, res) => {
  res.json({
    food: "pasta",
    sport: "kick ball",
    music: "gospel",
    career: ["MA", "CPT", "Code Developer"],
    shows: ["orphan black", "the 100", "the walking dead", "call the midwife"],
  });
});

app.get("/peach-pie", (req, res) => {
  res.json({
    ingredients: ["peach", "sugar", "wheat flour", "butter", "cinnamon"],
    nutrition: {
      carbohydrates: "38.1g",
      fat: "14g",
    },
  });
});

app.get("/books", (req, res) => {
  res.json({
    title: "Harry Potter and the Sorcerers stone",
    published: "2016",
    author: "J.K Rowling",
    pages: "246",
    people: [
      "Harry Potter",
      "Hermione Granger",
      "Ron Weasley",
      "Neville Longbottom",
    ],
  });
});
app.post("/echo", (req, res) => {
  res.json({
    received: req.body,
    message: "Echo successful!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
