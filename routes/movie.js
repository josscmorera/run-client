
var express = require('express');

const { 
  createMovie, 
  getMovie, 
  getAllMovies, 
  updateMovie, 
  deleteMovie, 
  createPopularMovies, 
  addRatingMovie,
  updateRatingMovie,
  removeRatingMovie,
  addCommentMovie,
  updateCommentMovie,
  removeCommentMovie
} = require('../controller/movieController');

const { checkIfEmpty } = require('../utils/checkIfEmpty');
const { jwtValidateAdmin, jwtValidate } = require('../utils/jwtValidate');

var router = express.Router();

router.get('/',  getAllMovies);
router.get('/:id', getMovie);
router.post('/new', jwtValidateAdmin, checkIfEmpty, createMovie);
router.put('/:id', jwtValidateAdmin, checkIfEmpty, updateMovie);
router.delete('/:id', jwtValidateAdmin, deleteMovie);

router.post('/populars/import',  createPopularMovies);

router.put('/:id/rating/add', jwtValidate, checkIfEmpty, addRatingMovie);
router.put('/:id/rating/update', jwtValidate, checkIfEmpty, updateRatingMovie);
router.put('/:id/rating/remove', jwtValidate, removeRatingMovie);

router.put('/:id/comment/add', jwtValidate, checkIfEmpty, addCommentMovie);
router.put('/:id/comment/:commentId/update', jwtValidate, checkIfEmpty, updateCommentMovie);
router.put('/:id/comment/:commentId/remove', jwtValidate, removeCommentMovie);




module.exports = router;