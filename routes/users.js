var express = require('express');
const { jwtValidate } = require('../utils/jwtValidate');
const { checkIfEmpty } = require('../utils/checkIfEmpty');
const { validateUserData } = require('../utils/validateUserData');
const { createUser, loginUser, validateUser } = require('../controller/userController');

var router = express.Router();

router.post('/new', checkIfEmpty, validateUserData,createUser);
router.post('/login', checkIfEmpty,  loginUser);
router.get('/validate', jwtValidate, validateUser);

module.exports = router;
