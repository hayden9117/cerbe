require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const User = require("../models/User"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;
router.get("/createAcc", async (req, res) => {
  res.render("SignUp", { User: User });
});

router.get("/loginPortal", async (req, res) => {
  res.render("Login", { User: User });
});
// Signup route to create a new user
router.post("/signup", async (req, res) => {
  const {
    username,
    firstname,
    lastname,
    email,
    password,
    passwordMatch,
    date,
  } = req.body;

  if (password === passwordMatch) {
    console.log(req.body);
    try {
      // hash the password
      delete req.body.passwordMatch;
      req.body.password = await bcrypt.hash(req.body.password, 10);
      // create a new user
      console.log(req.body);
      req.body.role = "Client";
      const user = await User.create(req.body);
      // send new user as response
      console.log(user);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json();
    }
  } else {
    res.send("passwords dont match");
  }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);

      if (result) {
        // sign token and send it in response
        console.log(user);
        const token = await jwt.sign(
          { id: user._id, username: user.username },
          SECRET
        );
        console.log(token);
        res
          .status(200)
          .send({ user: user.username, hash: token, projects: user.projects });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
