const { Router } = require("express"); // import Router from express
const Request = require("../models/clientRequests.model");
const { isLoggedIn } = require("./middleware"); // import isLoggedIn custom middleware

const router = Router();

router.get("/getProjects", async function (req, res) {
  
  Request.find(function (err, requests) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { requests: requests });
    }
  });
});
router.post("/update/:id", isLoggedIn, async function (req, res) {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  Request.findById(req.params.id, function (err, request) {
    if (!request) return next(new Error("Could not load Document"));
    else {
      console.log("teatdadff");
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
