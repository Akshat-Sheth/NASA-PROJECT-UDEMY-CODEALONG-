const launches = require('../../model/launches.model')
const { getPagination } = require('../../services/query')

async function getAllLaunches(req,res) {
    const {skip,limit} = getPagination(req.query)

    return res.status(200).json(await launches.getAllLaunches(skip,limit))
}

async  function addNewLaunch(req,res) {
    const launch = req.body;
    if(!launch.mission || !launch.launchDate || !launch.target || !launch.rocket){
        return res.status(400).json({
            error: "Missing fields"
        })
    }
    launch.launchDate = new Date(launch.launchDate)

    // launch.launchDate.toString() === 'invalid Date'
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error:"Invalid Launch Date"
        })
    }

    await launches.addNewLaunch(launch)
    return res.status(201).json(launch)
}


async function abortLaunch(req,res) {
    const LaunchId = Number(req.params.id)

    // if launch does not exist
    if(! await ( launches.existsLaunch(LaunchId))){
        return res.status(404).json({
            error:"Launch Does not Exist"
        })
    }
    // if launch ID is present 
    const aborted = await launches.abortLaunch(LaunchId)
    if(!aborted){
        return res.status(400).json({
            error: 'launch not aborted'
        })
    }
    return res.status(200).json(aborted)

}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    abortLaunch
}