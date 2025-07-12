const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require('../db');
const { buildTasteProfile } = require('../utils/tasteProfile');
const { scoreAndSortMovies } = require('../utils/scoreMovies');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Map genre IDs to names using TMDB /genre endpoint
async function getGenreMap() {
  const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
    params: { api_key: TMDB_API_KEY, language: 'en-US' }
  });
  const map = {};
  res.data.genres.forEach(g => map[g.id] = g.name);
  return map;
}

// GET /recommend/:uid (Global recommendation)
router.get('/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    const profile = await buildTasteProfile(uid);
    const genreMap = await getGenreMap();

    // Fetch 20 movies
    const page = Math.floor(Math.random() * 10) + 1;
    const discover = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: {
        api_key: TMDB_API_KEY,
        sort_by: 'popularity.desc',
        language: 'en-US',
        include_adult: false,
        page
      }
    });

    const rawMovies = discover.data.results.slice(0, 20);
    const movies = rawMovies.map(m => ({
      id: m.id,
      title: m.title,
      poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      rating: m.vote_average,
      genre_names: m.genre_ids.map(id => genreMap[id] || ''),
      release_date: m.release_date,
      language: m.original_language,
      popularity: m.popularity
    }));

    const scored = scoreAndSortMovies(movies, profile);
    const filtered = scored.filter(m =>
      !profile.likedTmdbIds.includes(m.id) && !profile.dislikedTmdbIds.includes(m.id)
    );

    if (!filtered.length) return res.status(404).json({ error: 'No recommendations found' });

    const best = filtered[0];

    // Get full details
    const detail = await axios.get(`https://api.themoviedb.org/3/movie/${best.id}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits'
      }
    });

    const d = detail.data;
    const cast = d.credits.cast.slice(0, 5).map(p => p.name).join(', ');
    const director = d.credits.crew.find(c => c.job === 'Director')?.name || 'Unknown';

    res.json({
      id: d.id,
      title: d.title,
      poster: `https://image.tmdb.org/t/p/w500${d.poster_path}`,
      rating: d.vote_average,
      description: d.overview,
      cast,
      director,
      genre: d.genres.map(g => g.name).join(', '),
      release_date: d.release_date,
      language: d.original_language
    });

  } catch (err) {
    console.error('Recommendation error:', err.message);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

// GET /recommend/from-watchlist/:uid
router.get('/from-watchlist/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    const profile = await buildTasteProfile(uid);

    const watchlistRes = await pool.query(
      `SELECT * FROM user_movie_actions WHERE uid = $1 AND action = 'watchlist'`,
      [uid]
    );
    const watchlist = watchlistRes.rows;

    if (!watchlist.length) {
      return res.status(400).json({ error: 'Watchlist is empty' });
    }

    // Fetch additional popularity from TMDB for each watchlist movie
    const enriched = await Promise.all(watchlist.map(async movie => {
      try {
        const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.tmdb_id}`, {
          params: { api_key: TMDB_API_KEY }
        });

        return {
          id: movie.tmdb_id,
          title: movie.title,
          poster: movie.poster,
          rating: movie.rating,
          genre_names: (movie.genre || '').split(',').map(g => g.trim()),
          release_date: movie.release_date,
          language: movie.language,
          popularity: tmdbRes.data.popularity || 0,
          cast: movie.cast_list,
          director: movie.director,
          description: movie.description
        };
      } catch {
        return null;
      }
    }));

    const validMovies = enriched.filter(m => m);
    const scored = scoreAndSortMovies(validMovies, profile);

    if (!scored.length) return res.status(404).json({ error: 'No match found in watchlist' });

    const best = scored[0];

    res.json({
      id: best.id,
      title: best.title,
      poster: best.poster,
      rating: best.rating,
      description: best.description,
      cast: best.cast,
      director: best.director,
      genre: best.genre_names.join(', '),
      release_date: best.release_date,
      language: best.language
    });

  } catch (err) {
    console.error('Watchlist recommendation error:', err.message);
    res.status(500).json({ error: 'Failed to recommend from watchlist' });
  }
});

module.exports = router;
