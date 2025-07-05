// server/routes/movie.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;

router.get('/', async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    // Step 1: Search for the movie
    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: API_KEY,
        query: title
      }
    });

    if (searchRes.data.results.length === 0)
      return res.status(404).json({ error: 'Movie not found' });

    const movie = searchRes.data.results[0];

    // Step 2: Get movie details and credits
    const detailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'credits'
      }
    });

    const details = detailsRes.data;
    const director = details.credits.crew.find(p => p.job === 'Director')?.name || 'N/A';
    const cast = details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
    const genre = details.genres.map(g => g.name).join(', ');

    // Format response to match OMDb-style keys
    res.json({
      Title: details.title,
      Poster: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
      imdbRating: details.vote_average,
      Plot: details.overview,
      Director: director,
      Actors: cast,
      Genre: genre
    });
  } catch (error) {
    console.error('TMDB error:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

module.exports = router;
