require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const KiltcoUser = require("../models/KiltcoUser"); // import user model
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
    email,
    company,
    phone,
    address,
    city,
    state,
    zip,
    password,
    passwordMatch,
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
      const user = await KiltcoUser.create(req.body);
      // send new user as response
      console.log(user);
      res.json({user});
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
  console.log(req.body)
  try {
   
    // check if the user exists
    const user = await KiltcoUser.findOne({ email: req.body.username });
    console.log(user)
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
          .send({ user: user.email, hash: token,company: user.company, phone: user.phone, address: user.address, city: user.city,state:  user.state, zip: user.zip  });
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


// post req that updates the kiltco user
router.post("/update", async (req, res) => {
  try {
    const { email, company, phone, address, city, state, zip,password } = req.body;
console.log(req)
    // const user = await KiltcoUser.findOneAndUpdate(
    //   email,
    //   {
    //     company,
    //     phone,
    //     address,
    //     city,
    //     state,
    //     zip,
    //     password,
    //   },
    //   { new: true }
    // );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});


router.post("/updatePassword", async (req, res) => {
 
  // try {
    const { email, password, passwordConfirm, passwordNew } = req.body;
    // get bearer token
    const token = req.headers.authorization.split(" ")[1];
    console.log(req.body)
    const user = await KiltcoUser.findOne({ email: req.body.email });
 console.log(user)
    if (user ) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
     if (result && password === passwordConfirm ){
  // update password for the user with the email
  const userNewPass = await KiltcoUser.findOneAndUpdate(
    email,
    {
      passwordNew,
    },
    { new: true }
  );
userNewPass.password = await bcrypt.hash(req.body.passwordNew, 10);

userNewPass.save();
  res.json(userNewPass);

      }else{
        res.status(400).json({ error: "password doesn't match" });



     }
    }


});


router.post("/changeEmail", async (req, res) => {
     
  try {
// check if email is already in use
    const { email, emailNew } = req.body;
    // get bearer token
    const token = req.headers.authorization.split(" ")[1];

// check if email exists in mongo db

      const userCount = await KiltcoUser.findOne({ email: emailNew }).count();

      console.log(userCount)

      if (userCount > 0) {
        res.status(400).json({ error: "email already in use" });
      } else {

        // update email for the user with the email
        const userNewEmail = await KiltcoUser.findOneAndUpdate(
          email,
          {
            email: emailNew,
          },
          { new: true }
        );

       
       userNewEmail.update()
        res.json(userNewEmail);
      }








  } catch (error) {
    res.status(400).json({ error });
  }
  

}

  )

  router.post("/changeAddress", async (req, res) => {
     
    try {
  // check if email is already in use
      const { email, emailNew } = req.body;
      // get bearer token
      const token = req.headers.authorization.split(" ")[1];
  
  // check if email exists in mongo db
  
        const userCount = await KiltcoUser.findOne({ email: emailNew }).count();
  
        console.log(userCount)
  
        if (userCount > 0) {
          res.status(400).json({ error: "email already in use" });
        } else {
  
          // update email for the user with the email
          const userNewEmail = await KiltcoUser.findOneAndUpdate(
            email,
            {
              email: emailNew,
            },
            { new: true }
          );
  
         
         userNewEmail.update()
          res.json(userNewEmail);
        }
  
  
  
  
  
  
  
  
    } catch (error) {
      res.status(400).json({ error });
    }
    
  
  }
  
    )
      

module.exports = router;
