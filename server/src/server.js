// This structure is used because we can organise the code by moving the express related code to another file names app.js

require('dotenv').config()

const mongoose = require('mongoose')
const { mongoConnect } = require('./services/mongo')
const http = require('http')
const app = require('./app')
const { loadPlanetsData } = require('./model/planets.model')
const { launchData } = require('./model/launches.model')
const PORT = process.env.PORT || 8000;

async function  startServer () {
    await mongoConnect()
    await loadPlanetsData()
    await launchData()

    server.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT} ...`)
    })
}


const server = http.createServer(app)





startServer();



