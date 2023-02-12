const express = require("express");
const app = express();
const { Router } = require("express"); // import router from express
const Request = require("../models/clientRequests.model");
const router = Router(); // create router to create route bundle
router.post("/postRequest", function (req, res) {
  console.log(req.body);
  const requestSchema = new Request(req.body);

  requestSchema.save((err) => {
    if (err) {
      console.log(err);
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

router.get("/getRequest", function (req, res) {
  const requestSchema = Request;
  requestSchema.find().then((requests) => {
    console.log(requests);
    if (requests.length > 0) {
      res.send(requests);
    } else {
      res.send(false);
    }
  });
});

module.exports = router;
