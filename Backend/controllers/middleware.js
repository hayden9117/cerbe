require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const { SECRET = "secret" } = process.env;
const isLoggedIn = async (req, res, next) => {
  let user = req.body.user;
  try {
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token

      if (token) {
        const payload = jwt.verify(token, SECRET);

        if (payload) {
          // store user data in request object
          user = payload;

          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      res.sendFile(path.join(__dirname, "public", "SignUp.html"));
    }
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};

// export custom middleware
module.exports = {
  isLoggedIn,
};
