// server/routes/auth.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const admin = require('../firebase');
require('dotenv').config();

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await admin.auth().createUser({
      email: username,
      password,
    });

    res.status(201).json({ success: true, uid: user.uid });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
