require('dotenv-flow').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
const port = process.env.PORT || '80';

console.log(`Running in ${process.env.NODE_ENV} mode`);

if (!process.env.VCS_HOST) {
  console.error('VCS_HOST env variable is missing.')
  process.exit(1);
}
console.log('VCS_HOST:', process.env.VCS_HOST);

if (!process.env.VCS_API_KEY) {
  console.error('VCS_API_KEY env variable is missing.')
  process.exit(1);
}
console.log('VCS_API_KEY:', process.env.VCS_API_KEY);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
} else {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  app.use(cors());
}

// Rooms: key=name
const rooms = {};

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many accounts created from this IP, please try again after an hour'
}));

app.options('/api/room', cors());
app.post('/api/room', cors(), async (req, res) => {
  try {
    const room = rooms[req.body.name.toLowerCase()];
    if (room) {
      console.log(`[POST /api/room]: Reject creating room ${req.body.name} as it already exists.`);
      res.status(409).send(`Room "${req.body.name}" already exists`);
      return;
    }
    let result = await fetch(`https://${process.env.VCS_HOST}/api/realtime/vcs/api/room`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-vcs-token': process.env.VCS_API_KEY
      },
      body: JSON.stringify({ name: req.body.name })
    });
    if (!result.ok) {
      throw `${result.status} ${result.statusText}`;
    }
    result = await result.json();
    result.domain = process.env.VCS_HOST;
    rooms[result.room.name.toLowerCase()] = result;
    console.log(`[POST /api/room]: Created room ${result.room.name}. Returning:`, result);
    res.json(result);
  } catch (err) {
    console.error('[POST /api/room]: Error creating room.', err);
    res.status(500).send('Error creating room');
  }
});

app.get('/api/room', cors(), (req, res) => {
  if (req.query.name) {
    const room = rooms[req.query.name.toLowerCase()];
    if (!room) {
      console.log(`[GET /api/room]: Room ${req.query.name} not found`);
      res.sendStatus(404);
    } else {
      console.log(`[GET /api/room]: Room ${req.query.name} found`);
      res.json(room);
    }
  } else {
    console.error('[GET /api/room]: Error fetching room:', err);
    res.status(500).send('Missing parameter [name]');
  }
});

app.get('/api/rooms', (req, res) => {
  const r = Object.values(rooms);
  console.log(`[GET /api/rooms]: Returning ${r.length} room(s)`);
  res.json(r);
});

app.get('/api/config', cors(), (req, res) => {
  const config = {
    VCS_HOST: process.env.VCS_HOST
  };
  console.log('Return configuration: ', config);
  res.json(config);
});

// Return index.html for all other routes.
// E.g. user navigates to /room?id=abc directly
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
