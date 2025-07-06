// server/routes/movie.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();


// GET /api/movie/next
router.get('/next', async (req, res) => {
  try {
    // Get TMDB popular or trending movies
    const trending = await axios.get('https://api.themoviedb.org/3/trending/movie/day', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US',
      }
    });

    const results = trending.data.results;
    if (!results.length) return res.status(404).json({ error: 'No movies found' });

    // Pick a random movie
    const randomMovie = results[Math.floor(Math.random() * results.length)];

    // Get full movie details
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
      genre: details.genres.map((g) => g.name).join(', ')
    });
  } catch (err) {
    console.error('TMDB fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch random movie' });
  }
});

module.exports = router;