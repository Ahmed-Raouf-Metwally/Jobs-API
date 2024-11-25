const User = require( '../models/User' )
const jwt = require( 'jsonwebtoken' )
require( 'dotenv' ).config();

const { UnauthenticatedError } = require( '../errors' )

const auth = async ( req, res, next ) =>
{
    const authHeader = req.headers.authorization
    if ( !authHeader || !authHeader.startsWith( 'Bearer ' ) )
    {
        throw new UnauthenticatedError( 'Authentication invalid' )
    }
    const token = authHeader.split( ' ' )[ 1 ]
    try
    {
        
        const payload = jwt.verify( token, process.env.JWT_KEY )

        req.user = { userId: payload.userId, name: payload.name }
        next()
    }
    catch ( error )
    {
        throw new UnauthenticatedError( 'Authentication invalid' )
    }
}
module.exports = auth;

