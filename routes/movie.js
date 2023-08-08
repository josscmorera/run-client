
var express = require('express');

const { 
  createMovie, 
  getMovie, 
  getAllMovies, 
  updateMovie, 
  deleteMovie, 
  createPopularMovies 
} = require('../controller/movieController');

const { checkIfEmpty } = require('../utils/checkIfEmpty');
const { jwtValidateAdmin } = require('../utils/jwtValidate');

var router = express.Router();

router.get('/',  getAllMovies);
router.get('/:id', getMovie);
router.post('/new', jwtValidateAdmin, checkIfEmpty, createMovie);
router.put('/:id', jwtValidateAdmin, checkIfEmpty, updateMovie);
router.delete('/:id', jwtValidateAdmin, deleteMovie);
router.post('/populars/import', jwtValidateAdmin, createPopularMovies);


module.exports = router;