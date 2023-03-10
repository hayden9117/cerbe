require("dotenv").config(); // load .env variables
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { PORT = 5000 } = process.env;
var cors = require("cors");
const morgan = require("morgan"); //import morgan
const UserRouter = require("./controllers/User");
const Client = require("./controllers/Clients");
const ClientRequests = require("./routes/clientRequests");
const Projects = require("./controllers/Project");
const Threads = require("./controllers/Threads");
const KiltcoUser = require("./controllers/KiltcoUser");
const { isLoggedIn } = require("./controllers/middleware"); // import isLoggedIn custom middleware

const origin =  process.env.DEV_ORIGIN;
// Import the mongoose module

// Bind connection to error event (to get notification of connection errors)

// const https = require("https"),
//   fs = require("fs");
// const options = {
//   key: fs.readFileSync("/srv/www/keys/site-key.pem"),
//   cert: fs.readFileSync("/srv/www/keys/chain.pem"),
// };

/*
-set your secret and salt it
-give your application a new key
-flag your app for httpOnly to prevent hijacks from non http sources
-set secure to true to force acceptance from TLS/SSL requests only
-set the domain to where the cookie is expected to come from
-set the path from where it is acceptable from the application’s domain and finally, when the cookie expires. 
*/

// https://www.securecoding.com/blog/javascript-as-backend-prone-to-security-risks/

// GLOBAL MIDDLEWARE
// how do i allow multiple origins?




app.use(cors(
  {
    origin: origin,  // allow to server to accept request from different origin
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: false,
  }
)); // add cors headers
app.use(morgan("tiny")); // log the request for debugging
app.use(express.json()); // parse json bodies



app.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", UserRouter);
app.use("/KiltcoUser",KiltcoUser);
app.use("/clientPortal", Client);
app.use("/ClientRequests", ClientRequests);
app.use("/project", Projects);
app.use("/threads", Threads); // send all "/user" requests to UserRouter for routing
app.listen(PORT, function () {
  console.log(`Node js Express server on ${PORT}`);
});
