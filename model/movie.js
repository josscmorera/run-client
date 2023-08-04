const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const movieSchema = new mongoose.Schema({
    _id : { type: String, default: uuidv4 },
    title: { type: String, required: true },
    poster_image: { type: String, required: true },
    backdrop_image: { type: String },
    overview: {type: String},
    trailer: {type: String},
    releaseDate: { type: Date },

    rating: {type: Number},
    
    ratings: {
      userId: {type: String},
      rating: {type: Number},
      comment: {type: String},
    },

    lastModified: { type: Date, default: Date.now },
    createAt: { type: Date, default: Date.now },
});


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;