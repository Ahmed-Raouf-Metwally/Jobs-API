const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = ( err, req, res, next ) =>
{
  let CustomError = {
    //set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try again later'
  }
  
  // Handle validation errors
  if ( err.name === 'ValidationError' )
  {
    CustomError.message = Object.values( err.errors )
      .map( ( item ) => item.message )
      .join( ' , ' )
    CustomError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Handle cast errors
  if ( err.name === 'CastError' )
  {
    CustomError.message = `No item found with the given ID : ${err.value }`
    CustomError.statusCode = StatusCodes.NOT_FOUND
  }
 
  // Handle duplicate key errors (e.g., MongoDB unique field constraint)
  if ( err.code && err.code === 11000 )
  {
    CustomError.message = `Duplicate value entered for ${ Object.keys( err.keyValue ) } field, please choose another value.`;
    CustomError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(CustomError.statusCode).json({ message : CustomError.message })
}

module.exports = errorHandlerMiddleware
