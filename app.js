require("dotenv").config();
var createError = require('http-errors');
var express     = require('express');
var path        = require('path');
const colors = require('colors');
var cookieParser= require('cookie-parser');
var logger      = require('morgan');



// require the routes
const productsRouter= require("./routes/products");
var userRouter      = require('./routes/user');
var adminRouter     = require('./routes/admin');
var indexRouter     = require("./routes/index");



const flash = require("connect-flash");
var hbs = require('express-handlebars')
const HBS = hbs.create({});
var fileUpload = require('express-fileupload')
var db=require('./config/connection')
var Handlebars = require('handlebars');
 var session = require('express-session')

 var app = express();
 
 app.use(express.json({ limit: '50mb' }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); 
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(flash());
app.use(
  session({
    secret:"Key",
    resave: true,
    saveUninitialized: false,
   //session expires after 3 hours
   cookie: { maxAge: 60 * 1000 * 60 * 3 }, 
    }),
    );
    Handlebars.registerHelper("inc", function(value, options)
    {
        return parseInt(value) + 1;
    });
    HBS.handlebars.registerHelper("ifCondition",function(v1,v2,options){
      if(v1==v2){
        return options.fn(this)
      }
      return options.inverse(this) 
    })

    HBS.handlebars.registerHelper("notEquals",function(v1,v2,options){
      if(v1!=v2){
        return options.fn(this)
      }
      return options.inverse(this) 
    })
    


 db.connect((err)=>{ 
      if(err) console.log('connection ERROR'+err );
      else console.log(`Database is connected to port`.yellow.bold );
        });



   //routes config
app.use("/products", productsRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
