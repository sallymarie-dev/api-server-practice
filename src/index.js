import express from "express";
import { supabase } from "./supabase.js";

const app = express();
const PORT = 3000;

//random id
import { randomUUID } from "node:crypto";

app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log(`${req.method} ${req.path}`, req.body);
  } else {
    console.log(`${req.method} ${req.path}`);
  }
  res.on("finish", () => {
    console.log(`Response status: ${res.statusCode}`);
  });

  next();
});

let snacksStorage = [
  {
    id: randomUUID(),
    name: "cheezit",
    price: 4.99,
    tags: ["crackers", "cheese snack"],
  },
  {
    id: randomUUID(),
    name: "Pringles",
    price: 2.49,
    tags: ["potato", "flavored crisp"],
  },
  {
    id: randomUUID(),
    name: "cakes",
    price: 4.49,
    tags: ["debbie cakes", "iced buns"],
  },
];
//level 23 completed
app.get("/snacks/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("snacks")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) {
    return res.status(200).json({ error: "Snack not found" });
  }
  res.json(data);
});

app.get("/snacks", async (req, res) => {
  const { data, error } = await supabase.from("snacks").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ snacks: data });
});

app.post("/snacks", async (req, res) => {
  const { name, price } = req.body;

  const newSnack = {
    id: randomUUID(),
    name,
    price,
  };
  if (!req.body?.name) {
    return res.status(400).json({ error: "Snack name is required" });
  }

  if (!req.body?.price && req.body?.price !== 0) {
    return res.status(400).json({ error: "Snack price is required" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ error: "Price must be a number" });
  }
  //random id

  snacksStorage.push(newSnack);
  res.status(201).json(newSnack);
});

app.put("/snacks/:id", async (req, res) => {
  const id = req.params.id;
  const { name, price } = req.body;

  const updatedSnack = {
    name,
    price,
  };

  const { data } = await supabase
    .from("snacks")
    .update(updatedSnack)
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Snack not found" });
  }

  res.json(data[0]);
});


app.delete("/snacks/:id", async (req, res) => {
  const { id } = req.params.id;
  await supabase.from("snacks").delete().eq("id", req.params.id);

  const snack = snacksStorage.find((s) => String(s.id) === String(id));

  if (!snack) {
    return res.status(404).json({ error: "Snack not found" });
  }

  snacksStorage = snacksStorage.filter((s) => String(s.id) !== String(id));

  res.status(200).json({ message: "Snack deleted successfully" });
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
