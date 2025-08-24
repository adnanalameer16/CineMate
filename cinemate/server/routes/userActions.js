const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/add-action', async (req, res) => {
  const {
    uid,
    tmdb_id,
    title,
    poster,
    cast_list,
    director,
    genre,
    action,
    release_date,
    rating,
    language
  } = req.body;

  if (!uid || !tmdb_id || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO user_movie_actions (
        uid, tmdb_id, title, poster, cast_list, director, genre, action,
        release_date, rating, language
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (uid, tmdb_id, action) DO NOTHING
    `;
    const values = [
      uid, tmdb_id, title, poster, cast_list, director, genre, action,
      release_date, rating, language
    ];

    await pool.query(query, values);
    res.status(200).json({ message: 'Movie action recorded' });
  } catch (err) {
    console.error('Database insert error:', err);
    res.status(500).json({ error: 'Failed to record movie action' });
  }
});
// GET /user/watchlist?uid=abcd123
router.get('/watchlist', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'UID is required' });

  try {
    const result = await pool.query(
      `SELECT tmdb_id, title, poster, cast_list, director, genre 
       FROM user_movie_actions 
       WHERE uid = $1 AND action = 'watchlist'`,
      [uid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ error: 'Failed to load watchlist' });
  }
});
  // GET /user/liked?uid=abc123
router.get('/liked', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'UID is required' });

  try {
    const result = await pool.query(
      `SELECT tmdb_id, title, poster, cast_list, director, genre 
       FROM user_movie_actions 
       WHERE uid = $1 AND action = 'liked'`,
      [uid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching liked movies:', err);
    res.status(500).json({ error: 'Failed to load liked movies' });
  }
});

// GET /user/disliked?uid=abc123
router.get('/disliked', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'UID is required' });

  try {
    const result = await pool.query(
      `SELECT tmdb_id, title, poster, cast_list, director, genre 
       FROM user_movie_actions 
       WHERE uid = $1 AND action = 'disliked'`,
      [uid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching disliked movies:', err);
    res.status(500).json({ error: 'Failed to load disliked movies' });
  }
});

// GET /user/stats?uid=abc123
router.get('/stats', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'UID is required' });

  try {
    const client = await pool.connect();

    const [likedRes, dislikedRes, watchlistRes, firstLikedRes, lastLikedRes] = await Promise.all([
      client.query(`SELECT COUNT(*) FROM user_movie_actions WHERE uid = $1 AND action = 'liked'`, [uid]),
      client.query(`SELECT COUNT(*) FROM user_movie_actions WHERE uid = $1 AND action = 'disliked'`, [uid]),
      client.query(`SELECT COUNT(*) FROM user_movie_actions WHERE uid = $1 AND action = 'watchlist'`, [uid]),
      client.query(`SELECT title, timestamp FROM user_movie_actions WHERE uid = $1 AND action = 'liked' ORDER BY timestamp ASC LIMIT 1`, [uid]),
      client.query(`SELECT title, timestamp FROM user_movie_actions WHERE uid = $1 AND action = 'liked' ORDER BY timestamp DESC LIMIT 1`, [uid])
    ]);

    client.release();

    res.json({
      total_liked: parseInt(likedRes.rows[0].count),
      total_disliked: parseInt(dislikedRes.rows[0].count),
      total_watchlist: parseInt(watchlistRes.rows[0].count),
      total_watched: parseInt(likedRes.rows[0].count) + parseInt(dislikedRes.rows[0].count),
      first_liked: firstLikedRes.rows[0] || null,
      last_liked: lastLikedRes.rows[0] || null
    });

  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// DELETE /user/watchlist
router.delete('/watchlist', async (req, res) => {
  const { uid, tmdb_id } = req.body;
  if (!uid || !tmdb_id) return res.status(400).json({ error: 'uid and tmdb_id are required' });

  try {
    await pool.query(
      `DELETE FROM user_movie_actions WHERE uid = $1 AND tmdb_id = $2 AND action = 'watchlist'`,
      [uid, tmdb_id]
    );
    res.json({ success: true, message: 'Movie removed from watchlist' });
  } catch (err) {
    console.error('Error removing from watchlist:', err);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

// DELETE /user/liked
router.delete('/liked', async (req, res) => {
  const { uid, tmdb_id } = req.body;
  if (!uid || !tmdb_id) return res.status(400).json({ error: 'uid and tmdb_id are required' });

  try {
    await pool.query(
      `DELETE FROM user_movie_actions WHERE uid = $1 AND tmdb_id = $2 AND action = 'liked'`,
      [uid, tmdb_id]
    );
    res.json({ success: true, message: 'Movie removed from liked' });
  } catch (err) {
    console.error('Error removing from liked:', err);
    res.status(500).json({ error: 'Failed to remove from liked' });
  }
});

// DELETE /user/disliked
router.delete('/disliked', async (req, res) => {
  const { uid, tmdb_id } = req.body;
  if (!uid || !tmdb_id) return res.status(400).json({ error: 'uid and tmdb_id are required' });

  try {
    await pool.query(
      `DELETE FROM user_movie_actions WHERE uid = $1 AND tmdb_id = $2 AND action = 'disliked'`,
      [uid, tmdb_id]
    );
    res.json({ success: true, message: 'Movie removed from disliked' });
  } catch (err) {
    console.error('Error removing from disliked:', err);
    res.status(500).json({ error: 'Failed to remove from disliked' });
  }
});



module.exports = router;
