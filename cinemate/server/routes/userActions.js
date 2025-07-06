const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/add-action', async (req, res) => {
  const { uid, tmdb_id, title, poster, cast_list, director, genre, action } = req.body;

  if (!uid || !tmdb_id || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO user_movie_actions (uid, tmdb_id, title, poster, cast_list, director, genre, action)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (uid, tmdb_id, action) DO NOTHING
    `;
    const values = [uid, tmdb_id, title, poster, cast_list, director, genre, action];
    await pool.query(query, values);
    res.status(200).json({ message: 'Movie action recorded' });
  } catch (err) {
    console.error('Database insert error:', err);
    res.status(500).json({ error: 'Failed to record movie action' });
  }
});

module.exports = router;
