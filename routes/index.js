var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Wave Accounting App Prototype' });
});

module.exports = router;
