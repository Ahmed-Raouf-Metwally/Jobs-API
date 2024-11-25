const Job = require( '../models/Job.js' )
const { StatusCodes } = require( 'http-status-codes' )
const { BadRequest, NotFoundError } = require( '../errors' )

const getAllJobs = async ( req, res ) =>
{
    const jobs = await Job.find( { createdBy: req.user.userId } ).sort( { createdAt: -1 } )
    res.status( StatusCodes.OK ).json( { jobs, totalJobs: jobs.length } )
}

const getJob = async ( req, res ) =>
{
    const {
        user: { userId },
        params: { id: jobId }
    } = req
    const job = await Job.findOne( { _id: jobId, createdBy: userId } )
    if ( !job )
    {
        throw new NotFoundError( `No job with id ${ jobId } exists` )
    }
    res.status( StatusCodes.OK ).json( { job } )
    // const job = await Job.findOne( { _id: req.params.id } )
    // if ( !job )
    // {
    //     throw new NotFoundError( `No job with id ${ req.params.id } exists` )
    // }
    // res.status(StatusCodes.OK).json({ job })

    // res.send( 'get job' )
}

const createJob = async ( req, res ) =>
{
    req.body.createdBy = req.user.userId
    const job = await Job.create( req.body )
    res.status( StatusCodes.CREATED ).json( { job } )
}

const updateJob = async ( req, res ) =>
{
    const {
        body :{company,position},
        user: { userId },
        params: { id: jobId }
    } = req
    if ( company === '' || position === '' )
    {
        throw new BadRequest( 'Please provide a valid company and position' )
    }
    const job = await Job.findByIdAndUpdate( { _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true } )
    if ( !job )
    {
        throw new NotFoundError( `No job with id ${ jobId } exists` )
    }
    res.status( StatusCodes.OK ).json( { job } )
}

const deleteJob = async ( req, res ) =>
{
    const {
        user: { userId },
        params: { id: jobId }
    } = req
    const job = await Job.findByIdAndDelete( { _id: jobId, createdBy: userId } )
    if ( !job )
    {
        throw new NotFoundError( `No job with id ${ jobId } exists` )
    }
    
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob

}