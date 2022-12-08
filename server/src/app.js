const express = require('express')
// const planetsRouter = require('./routes/planets/planet.router')
// const launchesRouter = require('./routes/launches/launches.router')
const app = express()
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')

// for the versioning of the routes
const api  = require('./routes/api')


app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
// app.use('/planets',planetsRouter)
// app.use('/launches',launchesRouter)
app.use('/v1',api)

app.get('/*', (req,res) =>{
    res.sendFile(path.join(__dirname, "..", 'public', 'index.html'))
})

module.exports = app