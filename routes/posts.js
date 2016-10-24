var express = require('express');
var router = express.Router();

router.get('/posts', function(req, res, next) {
res.json('asda')
});

module.exports = router;
