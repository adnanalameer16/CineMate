const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userActionsRoutes = require('./routes/userActions');
const movieRoutes = require('./routes/movie');
const recommendRoutes = require('./routes/recommend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Mount routes
app.use('/', authRoutes);
app.use('/movie', movieRoutes);
app.use('/user', userActionsRoutes);
app.use('/recommend', recommendRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
