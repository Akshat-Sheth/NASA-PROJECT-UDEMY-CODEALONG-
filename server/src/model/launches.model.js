const launches = require('./launches.mongo')
const planets = require('./planets.mongo')
const axios = require('axios')
// const launches = new Map();

// let latestflightNumber = 100;

const default_flight_number = 100;

// const launch = {
//     flightNumber: 100,
//     mission: 'Kepler Exploration X',
//     rocket : 'Explorer 1',
//     launchDate : new Date('December 27, 2030'),
//     target: 'Kepler-442 b',
//     customers: ['ZTM', 'NASA'],
//     upcoming: true,
//     success:true
// }

async function getAllLaunches(skip,limit) {
    
    // return Array.from(launches.values())
    return await launches.find({}, {
        '__v':0
    })
    .sort({flightNumber : 1})
    .skip(limit)
    .limit(limit)
}

async function saveLaunch(launch){

    // first parameter -> finding;
    // second parameter -> inserting;
    // third parameter -> inserting only if object not found

    // await launches.updateOne({
    //     flightNumber: launch.flightNumber
    // },
    //     launch,
    // {
    //     upsert:true
    // }
    // )


    // to remove the $setOnInsert field that us automatically added we use findOneAndUpdate function
    // it will only return the properties thatt we set in the 2nd parameter, not the extra 
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
        launch,
    {
        upsert:true
    }
    )
}

// launches.set(launch.flightNumber,launch)
// saveLaunch(launch)



async function getlatestFlightNumber(){
    // sorting in decending order -> just add "-" in front of the keyValue pair
    const lastestLaunch = await launches
                                .findOne()
                                .sort('-flightNumber')    

    if(!lastestLaunch){
        return default_flight_number
    }

    return lastestLaunch.flightNumber
}

// this is the function for the in memory approach
// function addNewLaunch(launch){
//     latestflightNumber++;
//     launches.set(latestflightNumber, Object.assign(launch,{
//         customers: ['ZTM', 'NASA'],
//         flightNumber: latestflightNumber,
//         upcoming:true,
//         success:true
//     }))
// }

// this is the funciton that works with the database
async function addNewLaunch(launch){
    // checking if the launch has a valid kepler Name
    // console.log(launch.target)
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if(!planet){
        throw new Error("No matching planet found")
    }
    const newFlightNumber = await getlatestFlightNumber(launch) + 1;
    const newLaunch = Object.assign(launch, {
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
        upcoming:true,
        success:true
    });
    await saveLaunch(newLaunch)

}


async function existsLaunch(launchId){
    return await launches.findOne({
        flightNumber: launchId
    })
}



async function abortLaunch(launchId){
    // this is for the static data
    // const aborted = launches.get(launchId)
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted

    // for the mongogo DB data
    const aborted =  await launches.updateOne({
        flightNumber: launchId
    },{
        upcoming:false,
        success:false
    })

    return aborted.modifiedCount === 1;
}


async function findLaunch(filter){
    return await launches.findOne(filter)
}


const spaceX_URL = `https://api.spacexdata.com/v4/launches/query`

async function populateLaunches() {
    console.log('downloading spaceX data .')
    const response =  await axios.post(spaceX_URL, {
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:'rocket',
                    select:{
                        name: 1
                    }
                },
                {
                    path:'payloads',
                    select:{
                        customers :1
                    }
                }
            ]
        }
    })

    if(response.status !== 200){
        console.log('Error downloading the data ...')
        throw new Error('launch data download failed')
    }

    const launchDocs =  response.data.docs
    

    for(const launch of launchDocs){

        const payloads = launch['payloads']
        const customers = payloads.flatMap((payload)=>{
            return payload['customers']
        })

        const launchS = {
            flightNumber: launch['flight_number'],
            mission: launch['name'],
            rocket : launch['rocket']['name'],
            launchDate : launch['date_local'],
            customers:customers ,
            upcoming: launch['upcoming'],
            success:launch['success']
        }

        console.log(`${launchS.flightNumber}  ${launchS.mission}`)

        await saveLaunch(launchS)
       

    }
}


async function launchData() {



    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })

    if(firstLaunch){
        console.log('Launch data is already in our database ...')
    }else{
        await populateLaunches()
    }

}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunch,
    abortLaunch,
    launchData
}
