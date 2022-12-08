const mongoose = require('mongoose')

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required:true
    },
    launchDate: {
        type:Date,
        required:true
    },
    mission:{
        type:String,
        required:true
    },
    rocket: {
        type:String,
        required:true
    },
    // this says that customers is an array of strings
    customers:[ String ],
    target: {
        // this will make sure that the target is the value whose id is in the Planet collection
        // this is the NOSQL approach
        
        // type: mongoose.ObjectId ,
        // ref: 'Planet'
        type:String,
        // we removed this required true because of the spaceX api
        // required:true
    },
    upcoming: {
        type:Boolean,
        required:true
    },
    success:{
        type:Boolean,
        required:true,
        default:true
    }
})


// launchesSchema is now assigned to Launch collection
module.exports = mongoose.model('Launch', launchesSchema)