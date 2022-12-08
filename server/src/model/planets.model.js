const { parse } = require('csv-parse')
const planets = require('./planets.mongo')
const fs = require('fs')
const path = require('path')
// we have to use our built in fs library to get the stream data as parse() funciton doesnot do that
// parse() is a function that return s us a event emitter that deals with the stream of data coming from that file.

// const results = []

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36  && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6
}


// here we are using promise as  our data is as a stream and is being processed and if the frontend request the data before it is completed proccing tahn it would not get the data


function loadPlanetsData() {
    return new Promise((resolve,reject) => {
        fs.createReadStream(path.join(__dirname,'..','..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment:'#',
            columns:true
        }))
        .on('data', async(data)=>{
            if(isHabitablePlanet(data)){
            //   results.push(data)


            // this is for saving data in the database
            // instead of directly pasing the data we are taking the long approach so as to match the schema  we defined
            // insert + update = upsert
            // this will insert the documen into the collection and the update part will help tto see that the document 
            // is not inserted if it is already inseted into the collection .
            // this is usefull becasue this  loadPlanetData() will be called multiple times in server.js if we create many clusters of it

                // await planets.create({
                //     keplerName : data.kepler_name
                // })

                savePlanet(data)



            }
        })
        .on('error', (err)=>{
          console.log(err)
          reject(err)
        })
        .on('end',async()=>{
            
            // console.log(`${results.length} habitable planets found`)
            const planetsCount = (await getAllPlanets()).length
            console.log(`${planetsCount} habitable planets found `)
            resolve()
        })
    })  
}


async function getAllPlanets() {
    // the first parameter is the filters
// the second parameter ro the find() is the projection ->  we can spcify which fields we need  &  also we can pass a string
//  return planets.find({}, {'keplerName  -anotherField '})  "-" sign says that to exclude that field
     return await planets.find({}, {
         '__v':0
     })
}


async function savePlanet(planet) {
        // using UPSERT -> 
    try{
        await planets.updateOne({
            keplerName: planet.kepler_name
       }, {
           keplerName: planet.kepler_name
           },{
           upsert:true
      })
    }catch(err){
        console.log(`Could not save the planet ${err}`)
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}





