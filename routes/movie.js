
var express = require('express');

const { 
  createMovie, 
  getMovie, 
  getAllMovies, 
  updateMovie, 
  deleteMovie, 
  createPopularMovies 
} = require('../controller/movieController');

var router = express.Router();

router.get('/', getAllMovies);
router.post('/new', createMovie);
router.get('/:id', getMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);
router.post('/populars/import', createPopularMovies);


module.exports = router;