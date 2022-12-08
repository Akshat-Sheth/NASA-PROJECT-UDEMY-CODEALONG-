const express = require('express')
const launchesRouter = express.Router()
const { getAllLaunches, addNewLaunch, abortLaunch } = require('./launches.controller')

launchesRouter.get('/', getAllLaunches)
launchesRouter.post('/', addNewLaunch )
launchesRouter.delete('/:id', abortLaunch )

module.exports = launchesRouter