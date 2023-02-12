require("dotenv").config();
const { Router } = require("express"); // import Router from express
const Project = require("../models/Projects");
const { isLoggedIn } = require("./middleware"); // import isLoggedIn custom middleware
const User = require("../models/User");
const router = Router();

router.post("/getProject", isLoggedIn, async function (req, res) {
  const { user } = req.body;
  console.log("tes" + user);
  const username = await User.findOne({ username: user });

  Project.find({ user_id: username._id.toHexString() }).then((projects) => {
    if (projects.length > 0) {
      res.send(projects);
    } else {
      res.send(false);
    }
  });
  //   Project.find(function (err, projects) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send("hi");
  //     }
  //   });
});
router.post("/postProject", isLoggedIn, async function (req, res) {
  const { user, projectname, message } = req.body;

  const username = await User.findOne({ username: user });

  /*
  
    {
    user_id: {
      type: String,
      required: true,
    },
    projectname: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["in progress", "awaiting review", "awaiting response", "complete"],
    },
    needsReview: {
      type: Boolean,
    },
    startDate: { type: Date },
    lastUpdated: { type: Date },
  },

  {
    collection: "Projects",
  }
  */ const today = new Date();

  try {
    const project = await Project.create({
      user_id: username._id.toHexString(),
      projectname: projectname,
      message: message,
      status: "awaiting review",
      needsReview: true,
      startDate: today,
      lastUpdated: today,
    });
    // send new user as response
    // add project to user's projects array
    username.projects.push(project._id);
    username.save();

    console.log(project);
    res.json(project);
  } catch (error) {
    res.status(400).json();
  }
});
router.post("/update/:id", isLoggedIn, async function (req, res) {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  Request.findById(req.params.id, function (err, request, next) {
    if (!request) return next(new Error("Could not load Document"));
    else {
      console.log(req.body);
      // do your updates here
      request.firstname = req.body.first;
      request.lastname = req.body.last;
      request.email = req.body.email;
      request.message = req.body.message;
      request.reason = req.body.reason;
      request
        .save()
        .then((request) => {
          res.redirect("/clientRequests/getRequest");
        })
        .catch((err) => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

router.post("/delete/:id", isLoggedIn, async function (req, res) {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  console.log(req.params.id);
  Request.findByIdAndRemove({ _id: req.params.id }, function (err, request) {
    if (err) {
      console.log(err);
    } else res.redirect("/clientRequests/getRequest");
  });
});

module.exports = router;
