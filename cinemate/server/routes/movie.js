// server/routes/movie.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.OMDB_API_KEY;

// GET /movie?title=Inception
router.get('/', async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const response = await axios.get(`https://www.omdbapi.com/`, {
      params: { t: title, apikey: API_KEY }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

module.exports = router;
