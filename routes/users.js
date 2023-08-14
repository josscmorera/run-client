var express = require('express');
const { jwtValidate } = require('../utils/jwtValidate');
const { checkIfEmpty } = require('../utils/checkIfEmpty');
const { validateUserData } = require('../utils/validateUserData');
const { createUser, loginUser, validateUser, addMovieFavorite, removeMovieFavorite, listFavorites } = require('../controller/userController');

var router = express.Router();

router.post('/login', checkIfEmpty,  loginUser);
router.get('/validate', jwtValidate, validateUser);
router.post('/register', checkIfEmpty, validateUserData, createUser);

router.get('/favorite/list', jwtValidate, listFavorites);
router.put('/favorite/add', jwtValidate, checkIfEmpty, addMovieFavorite);
router.put('/favorite/remove', jwtValidate, checkIfEmpty, removeMovieFavorite);

module.exports = router;
