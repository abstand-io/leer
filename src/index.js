const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

const places = require('./routes/places');

const port = process.env.PORT || 3000;

const app = express();
// app.use(helmet()); // activate later

const expiryDate = new Date(Date.now() + 60 * 60 * 1000)
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRET || 'localDev'
  // add other security features
}));

// serve static assets from here
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

// routes
app.use('/api/places', places);

// serve frontend SPA with static file server
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));

app.listen(port, () => console.log(`[JETZT] Backend running on port ${port}`));