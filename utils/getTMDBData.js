const Axios  = require("axios")
const { formatDate } = require("./functions")

const API_KEY = process.env.TMDB_API_KEY
const API_BASE = 'https://api.themoviedb.org/3'

const API_MOVIE_EN = `${API_BASE}/movie/{{id}}?language=en&append_to_response=credits&api_key=${API_KEY}`
const API_MOVIE_VIDEOS = `${API_BASE}/movie/{{id}}/videos?&api_key=${API_KEY}`

const API_POPULAR_MOVIES = `${API_BASE}/movie/now_playing?include_adult=false&include_video=true&language=en-US&page=1&sort_by=primary_release_date.desc&release_date.lte=${formatDate(new Date())}&api_key=${API_KEY}`

 const getDataFilm = async (tmdbId) => {
  try {
    const dataMovie = await Axios.get(API_MOVIE_EN.replace('{{id}}', tmdbId))
    
    const dataVideo = await Axios.get(
      API_MOVIE_VIDEOS.replace('{{id}}', tmdbId)
    )

    const movieDataEn = dataMovie.data

    const data = {
      title:  movieDataEn.title,
      overview: movieDataEn.overview,
      posterImage: movieDataEn.poster_path,
      backdropImage:  movieDataEn.backdrop_path,
      trailer: prepareTrailer(dataVideo.data),
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

const prepareTrailer = videos => {
  const newVideos =
    videos &&
    videos.results.filter(item => item.site === 'YouTube').map(item => item.key)

  return newVideos[0] ? newVideos[0] : ''
}

const getLastMovies = async () => {
  try {
    const data = await Axios.get(API_POPULAR_MOVIES)
    const promises = await Promise.all( data.data.results.map(async item => getDataFilm(item.id)))
    let filter = promises.filter(it => it.posterImage)
    if (filter.length < 3) {
      const data2 = await Axios.get(API_POPULAR_MOVIES.replace('page=1','page=2'))
      const promises2 = await Promise.all( data2.data.results.map(async item => getDataFilm(item.id)))
      filter = [...filter,promises2.filter(it => it.posterImage)]

    }
    return filter
  } catch (error) {
    console.error('Error Popular Movies', error)
    throw error
  }
}

module.exports = { getDataFilm, getLastMovies };