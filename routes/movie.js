
var express = require('express');

const { createMovie, getMovie, getAllMovies, updateMovie, deleteMovie, createPopularMovies } = require('../controller/movieController');

var router = express.Router();

router.get('/', getAllMovies);
router.post('/populars/new', createPopularMovies);
router.post('/new', createMovie);
router.get('/:id', getMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);


module.exports = router;