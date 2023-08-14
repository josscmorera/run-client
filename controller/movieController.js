const Movie = require('../model/movie');
const User = require('../model/user');

const { getDataFilm, getPopularMovies } = require('../utils/getTMDBData');

const createMovie = async (req, res) => {
    try {
        const { tmdbId } = req.body;

        const dataMovie = await getDataFilm({ tmdbId });

        if (!dataMovie) {
            return res.status(400).json({ success: false, message: "Id tmdb is not valid" });
        }
       
        const newMovie =  new Movie(dataMovie);
        const savedMovie = await newMovie.save();

        return res.status(200).json({ success: true, data: savedMovie });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const getMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const foundMovie = await Movie.findOne({ _id: id });

        if (!foundMovie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        return res.status(200).json({ success: true, data: foundMovie });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const getAllMovies = async (req, res) => {
    try {
        const foundMovies = await Movie.find({});

        if (!foundMovies) {
            return res.status(400).json({ success: false, message: "Movies not found" });
        }

        return res.status(200).json({ success: true, data: foundMovies });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}


const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, overview, posterPath, backdropPath, trailer, runTime, releaseDate, genres } = req.body;

        const foundMovie = await Movie.findOne({ _id: id });

        if (!foundMovie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        foundMovie.title = title || foundMovie.title;
        foundMovie.overview = overview || foundMovie.overview;
        foundMovie.posterPath = posterPath || foundMovie.posterPath;
        foundMovie.backdropPath = backdropPath || foundMovie.backdropPath;
        foundMovie.trailer = trailer || foundMovie.trailer;
        foundMovie.runTime = runTime || foundMovie.runTime;
        foundMovie.releaseDate = releaseDate || foundMovie.releaseDate;
        foundMovie.genres = genres || foundMovie.genres;

        const savedMovie = await foundMovie.save();

        return res.status(200).json({ success: true, data: savedMovie });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const deleteMovie = async (req, res) => {
    try {

        const { id } = req.params;

        const foundMovie = await Movie.findOne({ _id: id });

        if (!foundMovie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        await foundMovie.remove();

        return res.status(200).json({ success: true, message: "Movie deleted" });


    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
}

const createPopularMovies = async (req, res) => {
    try {
        var popularMoviesData = await getPopularMovies();
        console.log(popularMoviesData[0])
        const existMovies = await Movie.find({});

        if (!popularMoviesData) {
            return res.status(400).json({ success: false, message: "Error getting popular movies" });
        }

        if (existMovies.length > 0) {
            popularMoviesData = popularMoviesData.filter(item => !existMovies.some(existItem => existItem.tmdbId === item.tmdbId));
        }

        const newMovies = await Movie.insertMany(popularMoviesData);

        return res.status(200).json({ success: true, data: newMovies });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
}

const addRatingMovie = async (req, res) => {
    try {
        const {  rating } = req.body;
        const { id } = req.params;


        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        const movie = await Movie.findOne({ _id: id });

        if (!movie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        const existRating = movie.ratings.find(rating => rating.userId === decodedToken.id)

        if(existRating){
            return res.status(400).json({ success: false, message: "You already rated this movie" });
        }

        movie.ratings.push({userId: findUser._id, rating})

        movie.rating = movie.ratings.reduce((acc, item) => acc + item.rating, 0) / movie.ratings.length

        const savedMovie = await movie.save()

        return res.status(200).json({ success: true, data: savedMovie });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message });
    }
}

const updateRatingMovie = async (req, res) => {
    try {
        const {  rating } = req.body;
        const { id } = req.params;

        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        const movie = await Movie.findOne({ _id: id });

        if (!movie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        const ratingIndex = movie.ratings.findIndex(rating => rating.userId === findUser._id)

        if(ratingIndex === -1){
            return res.status(400).json({ success: false, message: "You have not rated this movie" });
        }

        movie.ratings[ratingIndex].rating = rating

        movie.rating = movie.ratings.reduce((acc, item) => acc + item.rating, 0) / movie.ratings.length

        const savedMovie = await movie.save()

        return res.status(200).json({ success: true, data: savedMovie });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const removeRatingMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        const movie = await Movie.findOne({ _id: id });

        if (!movie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        const ratingIndex = movie.ratings.findIndex(rating => rating.userId === findUser._id)

        if(ratingIndex === -1){
            return res.status(400).json({ success: false, message: "You have not rated this movie" });
        }

        movie.ratings.splice(ratingIndex, 1)

        movie.rating = movie.ratings.length > 0 ? movie.ratings.reduce((acc, item) => acc + item.rating, 0) / movie.ratings.length : 0

        const savedMovie = await movie.save()

        return res.status(200).json({ success: true, data: savedMovie });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const addCommentMovie = async (req, res) => {
    try {
        const { comment } = req.body;
        const { id } = req.params;

        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        const movie = await Movie.findOne({ _id: id });

        if (!movie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        movie.comments.push({userId: findUser._id, comment, userName: findUser.firstName })

        const savedMovie = await movie.save()

        return res.status(200).json({ success: true, data: savedMovie });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message });
    }
}

const updateCommentMovie = async (req, res) => {
    try {
        const { comment } = req.body;
        const { id, commentId } = req.params;

        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        const movie = await Movie.findOne({ _id: id });

        if (!movie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        const commentIndex = movie.comments.findIndex(comment => comment._id === commentId && comment.userId === findUser._id)

        if(commentIndex === -1){
            return res.status(400).json({ success: false, message: "You have not rated this movie" });
        }

        movie.comments[commentIndex].comment = comment


        const savedMovie = await movie.save()

        return res.status(200).json({ success: true, data: savedMovie });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const removeCommentMovie = async (req, res) => {
    try {
        const { id, commentId } = req.params;

        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({_id: decodedToken.id})

        const movie = await Movie.findOne({ _id: id });

        if (!movie) {
            return res.status(400).json({ success: false, message: "Movie not found" });
        }

        const commentIndex = movie.comments.findIndex(comment => comment.userId === findUser._id && comment._id === commentId)

        if(commentIndex === -1){
            return res.status(400).json({ success: false, message: "You have not rated this movie" });
        }

        movie.comments.splice(commentIndex, 1)

        const savedMovie = await movie.save()

        return res.status(200).json({ success: true, data: savedMovie });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = { 
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
};