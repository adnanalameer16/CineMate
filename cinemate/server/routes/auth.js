// server/routes/auth.js
const express = require('express');
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

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.idToken) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: data.error.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
