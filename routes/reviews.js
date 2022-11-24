const express= require('express');
var router = express.Router();
const middleware    = require("../middleware");



router.get ('/reviews/:page?',(req ,res ,next)=>{
res.render('user/reviews')

} )



module.exports = router;