const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Mount your auth route
app.use('/', authRoutes);  // This makes POST /signup available

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
