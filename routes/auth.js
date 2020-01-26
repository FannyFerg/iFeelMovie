const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "") {
    res.render("auth/signup", {
      errorMessage: "Indiquer un nom d'utilisateur pour vous inscrire"
    });
    return;
  }

    
  else if (password === "") {
    res.render("auth/signup", {
      errorMessage: "Indiquez un mot de passe pour vous inscrire"
    });
    return;
  }

  User.findOne({ "username": username })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return; // ✋STOP
      }


  // Let's hash the password
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass // 👈 store the hashed version
  })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => next(err))
});
User.findOne({ "username": username })
.then(user => {
  if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      password: hashPass
    })
    .then(() => {
      res.redirect("/secret");
    })
    .catch(error => {
      console.log(error);
    })
})
.catch(error => {
  next(error);
})

  .catch(error => {
    next(error);
  })
}
)

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/secret");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});


module.exports = router