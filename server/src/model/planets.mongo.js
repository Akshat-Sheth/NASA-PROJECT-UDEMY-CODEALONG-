const mongoose = require('mongoose')

const PlanetsSchema = new mongoose.Schema({
    keplerName:{
        type:String,
        required:true
    }
})


// planetsSchema is now assigned to the planet model
module.exports = mongoose.model('Planet', PlanetsSchema)