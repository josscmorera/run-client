var express = require('express');
const { jwtValidate } = require('../utils/jwtValidate');
const { checkIfEmpty } = require('../utils/checkIfEmpty');
const { validateUserData } = require('../utils/validateUserData');
const { createUser, loginUser, validateUser, addMovieFavorite, removeMovieFavorite } = require('../controller/userController');

var router = express.Router();

router.post('/new', checkIfEmpty, validateUserData, createUser);
router.get('/login', checkIfEmpty,  loginUser);
router.get('/validate', jwtValidate, validateUser);

router.put('/favorite/add', jwtValidate, checkIfEmpty, addMovieFavorite);
router.put('/favorite/remove', jwtValidate, checkIfEmpty, removeMovieFavorite);

module.exports = router;
