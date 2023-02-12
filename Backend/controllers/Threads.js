require("dotenv").config();
const { Router } = require("express"); // import Router from express
const Thread = require("../models/Thread");
const { isLoggedIn } = require("./middleware"); // import isLoggedIn custom middleware
const User = require("../models/User");
const Project = require("../models/Projects");
const router = Router();
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const { SECRET = "secret" } = process.env;
router.post("/getThread", isLoggedIn, async function (req, res) {
  const { user } = req.body;
  console.log("tes" + user);
  const username = await User.findOne({ username: user });
  console.log(username._id.toHexString());
  Thread.find({ user_id: username._id.toHexString() }).then((threads) => {
    if (threads.length > 0) {
      res.send(threads);
    } else {
      res.send(false);
    }
  });
  //   thread.find(function (err, threads) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send("hi");
  //     }
  //   });
});
router.post("/postThread", isLoggedIn, async function (req, res) {
  const { thread, body, token, projectId, date } = req.body;
  const userId = jwt.decode(req.body.token);
  const user = await User.findOne({
    user_id: userId._id,
    username: userId.username,
  });

  const projects = await Project.find({
    user_id: userId.id,
  });
  const project = projects.filter((i) => {
    console.log(i._id);
    return i._id.toHexString() === projectId;
  })[0];

  const today = new Date();

  try {
    if (project.status !== "awaiting review") {
      const threadScheme = await Thread.create({
        project_id: project._id.toHexString(),
        user_id: user._id.toHexString(),
        threadname: thread,
        replys: [],
        body: body,
        postdate: today,
        lastUpdated: today,
      });
      // send new user as response
      console.log(threadScheme);
      console.log(project);
      if (threadScheme) {
        project.threads.push({
          user_id: user._id.toHexString(),
          thread_id: threadScheme._id.toHexString(),
          postedBy: user.username,
          threadname: thread,
        });
        project.save();
      }
      res.send({ thread: thread, project: project });
    } else {
      console.log(project);
      res.send({ thread: null, project: project });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json();
  }
});
module.exports = router;
