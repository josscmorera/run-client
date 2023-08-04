var express = require('express');
const { createAdmin } = require('../controller/adminController');
var router = express.Router();

router.get('/new', createAdmin);

module.exports = router;
