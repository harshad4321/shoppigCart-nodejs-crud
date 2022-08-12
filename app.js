var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const productsRouter = require("./routes/products");
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var indexRouter  = require("./routes/index");

const flash = require("connect-flash");
var hbs = require('express-handlebars')
var fileUpload = require('express-fileupload')
var db=require('./config/connection')
 var session = require('express-session')
 var app = express();

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
 db.connect((err)=>{ 
      if(err) console.log('connection ERROR'+err);
      else console.log("Database is connected to port 27017");
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
