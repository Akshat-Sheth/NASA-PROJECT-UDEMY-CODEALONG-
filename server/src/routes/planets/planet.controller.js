const planets = require('../../model/planets.model')

async function getAllPlanets (req,res) {
    // we have the return just because to ensure that the response is set only once.
    return res.status(200).json(await planets.getAllPlanets())
}



module.exports = {
    getAllPlanets
}