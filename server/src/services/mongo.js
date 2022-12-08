const mongoose = require('mongoose')

require('dotenv').config();
 
const mongoURL = process.env.MONGO_URL


// this is an event emitter that will emit event when connection is established of if there is some error
mongoose.connection.once('open',()=>{
    console.log('MongoDB connection is ready !!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect(){
   await  mongoose.connect(mongoURL)

    // the options are always considered for the latest version of the mongoose so no need to write it
     

    // await mongoose.connect(mongoURL,{
    //     // this  determines how mongoose parses that string that we just passed ...
    //     useNewUrlParser : true,
    //     // this disables the outdated way of updating data ...
    //     useFindAndModify: false,
    //     // this will use the createIndex function inplace of the old ensure index ffunction
    //     useCreateIndex :true,
    //     // this will make sure that mongoose will use the updated way of talking with  clusters of our database 
    //     useUnifiedTopology: true
    // })

}


async function mongooseDisconnect(){
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongooseDisconnect
}



