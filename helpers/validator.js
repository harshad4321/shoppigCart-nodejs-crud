const { check, validationResult } = require("express-validator");

const userSignUpValidationRules = () => {
  return [
    check("name", "Name is required").not().isEmpty(),
    check("name", "at least 4 character required,please enter your full Name").isLength({ min: 4 }),
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage('Please enter a password with 4 or more characters'),
     
      check("confirm_password")
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage('Passwords must match.')
    .custom((value,{req})=>{
      if(value !==req.body.password)
      {  // trow error if passwords do not match
        throw new Error("Passwords don't match,please enter correct password");
      }else {
        return value;
    }
    })
  ];
};
const userSignInValidationRules = () => {
  return [
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("password", "Invalid password").not().isEmpty().isLength({ min: 4 }),
  ];
};

const userContactUsValidationRules = () => {
  return [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email address")
      .not()
      .isEmpty()
      .isEmail(),
    check("message", "Please enter a message with at least 10 words")
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      
  ];
};

const validateSignup = (req, res, next) => {
  
    
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/signup");
  }
  next();
};

const validateSignin = (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect('/login');
  }
  next();
};

const validateContactUs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    console.log(messages);
    req.flash("error", messages);
    return res.redirect("/pages/contact-us");
  }
  next();
};

module.exports = {
  userSignUpValidationRules,
  userSignInValidationRules,
  userContactUsValidationRules,
  validateSignup,
  validateSignin,
  validateContactUs,
};
