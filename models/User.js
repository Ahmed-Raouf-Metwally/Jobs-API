const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs' )
const jwt = require( 'jsonwebtoken' )
require( 'dotenv' ).config();


const UserSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [ true, 'please provide name' ],
        minlength: 3,
        maxlength: 50

    },
    email: {
        type: String,
        required: [ true, 'please provide email' ],
        unique: true,
        match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please provide a valid email'
        ],
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: [ true, 'please provide password' ],
        minlength: 6,
    }
} );

UserSchema.pre( 'save', async function ()
{
    const salt = await bcrypt.genSalt( 10 );
    this.password = await bcrypt.hash( this.password, salt );
} )

UserSchema.methods.getName = function ()
{
    return this.name
}
UserSchema.methods.generateJWTToken = function ()
{
    return jwt.sign( { userId: this._id, name: this.name }, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_LIFETIME
    } )
}

UserSchema.methods.comparePassword = async function ( candidatePassword )
{
    return await bcrypt.compare( candidatePassword, this.password );
}

module.exports = mongoose.model( 'User', UserSchema )
