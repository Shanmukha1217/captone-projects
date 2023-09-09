//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/userDB")
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((err) => console.log(err));

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

app.get("/", async (req, res) => {
  // res.send("I'm here");

  res.render("home");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => {
      console.log("User added to DB");
      res.render("secrets");
    })
    .catch((err) => res.send(err));
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  await User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser.password == password) {
        console.log(foundUser.password);
        res.render("secrets");
      } else {
        res.send("No Credentials found");
      }
    })
    .catch((err) => res.send(err));
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});