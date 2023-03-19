var express = require("express");
var router = express.Router();
const userHelpers = require("../helpers/user-helpers");
const middleware = require("../middleware");
const generateToken = require('../utils/generateToken')
const protect = require('../middleware/authMiddleware')


const {
  userSignUpValidationRules,
  validateSignup,
} = require("../helpers/validator");


// GET: display the signup  
router.get('/signup', middleware.verifyNotLogin,
  async (req, res) => {
    // checking SignupErr
    res.render('user/signup', { "SignupErr": req.session.userSignupErr })
    req.session.userSignupErr = null
    //  checking errorMsg 
    var errorMsg = req.flash("error")[0];
    res.render('user/signup', { errorMsg })
  });



// POST: handle the signup logic
router.post(
  '/signup',
  [
    userSignUpValidationRules(),
    validateSignup,
  ],
  (req, res) => {
    userHelpers.exists(req.body).then((response) => {
      if (response.status) {
        req.session.userSignupErr = "Email already exists"
        res.redirect('/user/signup')
      } else {
        userHelpers.doSignup(req.body).then((response) => {
          req.session.loggedIn = true
          req.session.user = response
          let user = req.session.user._id;
          const token = generateToken({ user });
          console.log({ token: token })
          res.cookie('jwt', token, { httpOnly: true });
          res.redirect('/')
        })
      }
    });
  })


// GET: display the login form
router.get('/login', (req, res) => {
  // check if a user is logged in or not
  console.log('user>>>>>.', req.session.user);
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.userLoginErr, })
    req.session.userLoginErr = null

  }
});


// POST: handle the signin logic
router.post(
  '/login',
  (req, res) => {
    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true,
          console.log('req.session.loggedIn>><<<', req.session.loggedIn)
        req.session.user = response.user
        let user = req.session.user._id;
        const token = generateToken({ user });
        console.log({ token: token })
        res.cookie('jwt', token, { httpOnly: true });
        res.redirect('/')
      } else {
        req.session.userLoginErr = "Invalid Email or password, try again!"
        res.redirect('/user/login')
      }
    });
  });





// GET: logout
router.get('/logout', middleware.verifyLogin, (req, res) => {
  req.session.user = null
  // req.session.user=false
  res.clearCookie('jwt')
  req.session.loggedIn = false
  res.redirect('/')
})



// ------------------user profile-------------------------

router.get("/my-profile", middleware.verifyLogin, protect, async (req, res) => {
  try {
    res.render("user/user-profile", {
      user: req.session.user, cartCount, user_head: true
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/")
  }
});

router.get('/edit-profile', middleware.verifyLogin, protect, async (req, res) => {
  try {
    res.render('user/edit-profile', {
      user: req.session.user, user_head: true, cartCount
    });
  } catch (error) {
    console.log(error);
  }
})

router.post("/edit-profile/:id", middleware.verifyLogin, protect, (req, res) => {

  try {
    userHelpers.editUserProfile(req.params.id, req.body).then(() => {
      res.redirect("/");
    })
  } catch (error) {
    res.redirect("/");

  }
});


router.get('/change-password', middleware.verifyLogin, async (req, res) => {
  try {
    res.render('user/change-password', {
      user: req.session.user, user_head: true, cartCount
    })

  } catch (error) {
    console.log(error);
  }
})

router.post('/change-password', middleware.verifyLogin, async (req, res) => {
  try {
    console.log('req.body, req.session.user._id>>>>>>>.', req.body, req.session.user._id)
    userHelpers.changePassword(req.body, req.session.user._id).then((response) => {

      res.redirect('/')
    })
  } catch (error) {
    console.log(error);
  }
})



module.exports = router;

