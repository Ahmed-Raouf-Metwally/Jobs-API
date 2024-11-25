const mongoose = require( 'mongoose' )

const JobSchema = new mongoose.Schema( {
    company: {
        type: String,
        required: [ true, "Please provide company name" ],
        maxlength: 50,
        

    },
    position: {
        type: String,
        required: [ true, "Please provide position name" ],
        maxlength: 100
    },
    status: {
        type: String,
        enum: [ "pending", "interview", "declined" ],
        default: "pending"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [ true, "Please provide user" ]
    }
},
    { timestamps: true }
);

module.exports = mongoose.model( "Job", JobSchema );

    