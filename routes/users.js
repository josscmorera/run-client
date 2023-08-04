var express = require('express');
const { createUser } = require('../controller/userController');
var router = express.Router();

router.get('/new', createUser);

module.exports = router;
