const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.get('/next', async (req, res) => {
  try {
    // 1. Fetch a bigger pool of popular movies (e.g. first 5 pages = 100 movies)
    const allMovies = [];
    for (let page = 1; page <= 5; page++) {
      const popular = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: process.env.TMDB_API_KEY,
          sort_by: 'popularity.desc',
          language: 'en-US',
          include_adult: false,
          include_video: false,
          page
        }
      });

      allMovies.push(...popular.data.results);
    }

    if (!allMovies.length) return res.status(404).json({ error: 'No movies found' });

    // 2. Pick a random movie
    const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];

    // 3. Get detailed info for the selected movie
    const detailRes = await axios.get(`https://api.themoviedb.org/3/movie/${randomMovie.id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: 'credits'
      }
    });

    const details = detailRes.data;

    const cast = details.credits.cast.slice(0, 5).map((a) => a.name).join(', ');
    const director = details.credits.crew.find((c) => c.job === 'Director')?.name || 'Unknown';

    res.json({
      id: details.id,
      title: details.title,
      poster: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
      rating: details.vote_average,
      description: details.overview,
      cast,
      director,
      genre: details.genres.map((g) => g.name).join(', '),
      release_date: details.release_date,
      language: details.original_language
    });

  } catch (err) {
    console.error('TMDB fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch random movie' });
  }
});

module.exports = router;
