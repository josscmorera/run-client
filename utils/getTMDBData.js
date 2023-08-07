const { Axios } = require("axios")

const API_KEY = process.env.TMDB_API_KEY
const API_BASE = 'https://api.themoviedb.org/3'

const API_MOVIE_EN = `${API_BASE}/movie/{{id}}?language=en&append_to_response=credits&api_key=${API_KEY}`
const API_MOVIE_VIDEOS = `${API_BASE}/movie/{{id}}/videos?&api_key=${API_KEY}`

const API_POPULAR_MOVIES = `${API_BASE}/discover/movie?include_video=true&language=en-US&page=1&sort_by=popularity.desc&api_key=${API_KEY}`


 const getDataFilm = async (tmdbId) => {
  try {
    const dataMovie = await Axios.get(API_MOVIE_EN.replace('{{id}}', tmdbId))
    
    const dataVideo = await Axios.get(
      API_MOVIE_VIDEOS.replace('{{id}}', tmdbId)
    )

    const movieDataEn = dataMovie.data

    const data = {
      title:  movieDataEn.original_title,
      overview: movieDataEn.overview,
      posterPath: movieDataEn.poster_path,
      backdropPath:  movieDataEn.backdrop_path,
      trailer: prepareVideos(dataVideo.data)[0],
      runTime:  movieDataEn.runtime,
      releaseDate: movieDataEn.release_date,
      genres: movieDataEn.genres,
      tmdbId
     
    }

    return data
  } catch (error) {
    console.error('Error Movie', error)
    throw error
  }
}

const prepareVideos = videos => {
  const newVideos =
    videos &&
    videos.results.filter(item => item.site === 'YouTube').map(item => item.key)

  return newVideos || []
}

const getPopularMovies = async () => {
  try {
    const data = await Axios.get(API_POPULAR_MOVIES)
    return await Promise.all( data.data.results.map(async item => getDataFilm(item.id)))
  } catch (error) {
    console.error('Error Popular Movies', error)
    throw error
  }
}

module.exports = { getDataFilm, getPopularMovies };