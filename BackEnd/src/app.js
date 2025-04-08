const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')
const compilerRoute = require('./routes/compiler.route');
const app = express()

app.use(cors())




app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/ai', aiRoutes)
app.use('/api', compilerRoute);
module.exports = app