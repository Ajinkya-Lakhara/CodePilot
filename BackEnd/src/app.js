const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')
const compilerRoute = require('./routes/compiler.route');
const app = express()

const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'https://codepilot-1-gzwc.onrender.com' // hosted frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));





app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/ai', aiRoutes)
app.use('/api', compilerRoute);
module.exports = app