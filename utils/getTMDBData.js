const { Axios } = require("axios")

const API_BASE = 'https://api.themoviedb.org/3'
const API_KEY = 'd5a7cd6a4dad81c336cd89aa19c3bb62'

const API_MOVIE_EN = `${API_BASE}/movie/{{id}}?language=en&append_to_response=credits&api_key=${API_KEY}`
const API_MOVIE_VIDEOS = `${API_BASE}/movie/{{id}}/videos?&api_key=${API_KEY}`


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

module.exports = { getDataFilm };