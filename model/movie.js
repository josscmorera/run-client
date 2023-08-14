const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const movieSchema = new mongoose.Schema({
    _id : { type: String, default: uuidv4 },
    title: { type: String, required: true },
    posterImage: { type: String, required: true },
    backdropImage: { type: String },
    overview: {type: String},
    trailer: {type: String},
    releaseDate: { type: Date },
    runTime: { type: Number },
    tmdbId: { type: Number },

    rating: {
      type: Number,
      default: 0,
    },

    genres: [{
      _id : { type: String, default: uuidv4 },
      name: {type: String},
    }],
    
    ratings: [{
      userId: {type: String},
      rating: {type: Number},
    }],

    comments: [{
      _id : { type: String, default: uuidv4 },
      userId: {type: String},
      userName: {type: String},
      comment: {type: String},
      createdAt: {type: Date, default: Date.now},
    }],

    lastModified: { type: Date, default: Date.now },
    createAt: { type: Date, default: Date.now },
});


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;