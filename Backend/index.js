const express = require("express")
const app = express();
const cors = require("cors")
const fs = require("fs");
const path = require("path")
const PORT = 3500;

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../Frontend")));




const USERS_FILE = path.join(__dirname, "users.json");
const RECEIPES_FILE = path.join(__dirname, "receipes.json");



const read = (file) =>JSON.parse(fs.readFileSync(file, "utf-8"))
const write = (file, data) =>
fs.writeFileSync(file, JSON.stringify(data, null, 2))

app.post("/register", (req, res) => {
    const { email, password } = req.body;
    const users = read(USERS_FILE);
  
    const exists = users.find((u) => u.email === email);
    if (exists) return res.status(400).json({ msg: "User already exists" });
  
    users.push({ id: Date.now(), email, password });
    write(USERS_FILE, users);
  
    res.json({ msg: "Registered successfully" });
    res.render("login.html")
  });


  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const users = read(USERS_FILE);
  
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ msg: "Invalid email or password" });
  
    res.json({ token: email });
  });


  app.get("/receipes", (req, res) => {
    const recipes = read(RECEIPES_FILE);
    res.json(recipes);
  });
  


  app.get("/receipes/:id", (req, res) => {
    const recipes = read(RECEIPES_FILE);
    const recipe = recipes.find((r) => r.id == req.params.id);
    res.json(recipe);
  });
  

  app.post("/receipes", (req, res) => {
    const { title, ingredients, instructions, image, user } = req.body;
    const recipes = read(RECEIPES_FILE);
  
    recipes.push({
      id: Date.now(),
      title,
      ingredients,
      instructions,
      image,
      user,
    });
  
    write(RECEIPES_FILE, recipes);
    res.json({ msg: "Recipe added" });
  });
  


app.listen(PORT, ()=>{

    console.log(`successfully created port at ${PORT}`)
})