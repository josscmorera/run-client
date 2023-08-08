const Movie = require('../model/movie');
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
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
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
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
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
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
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
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
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
      return res.status(400).json({ success: false, message: err.message });
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
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
}




module.exports = { createMovie, getMovie, getAllMovies, updateMovie, deleteMovie, createPopularMovies };