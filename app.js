require( 'dotenv' ).config();
require( 'express-async-errors' );

//extra security packages
const rateLimit = require( 'express-rate-limit' );
const cors = require( 'cors' );
const xss = require( 'xss-clean' );
const helmet = require( 'helmet' );

//Swagger
const swaggerUI = require( 'swagger-ui-express' );
const YAML = require( 'yamljs' );
const swaggerDocument = YAML.load( './swagger.yaml' );


const express = require( 'express' );
const app = express();

//connectDB
const connectDB = require( './db/connect' )

//middlewares
const authenticateUser = require( './middleware/authentication' )
//routers
const authRouter = require( './routes/auth' )
const jobsRouter = require( './routes/jobs' )

// error handler
const notFoundMiddleware = require( './middleware/not-found' );
const errorHandlerMiddleware = require( './middleware/error-handler' );

app.use( express.json() );

// extra packages
app.set( 'trust proxy', 1 );
// app.use( rateLimit( {
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   // store: ... , // Redis, Memcached, etc. See below.
// } ) );
app.use( cors() );
app.use( xss() );
app.use( helmet() );


app.get( '/', ( req, res ) =>
{
  res.send( '<h1>Jobs API</h1>  <a href="/api-docs">Documentation</a>' );
} );
app.use( '/api-docs', swaggerUI.serve , swaggerUI.setup(swaggerDocument) );

// routes
app.use( '/api/v1/auth', authRouter )
app.use( '/api/v1/jobs', authenticateUser, jobsRouter )

app.use( notFoundMiddleware );
app.use( errorHandlerMiddleware );

const port = process.env.PORT || 3000;

const start = async () =>
{
  try
  {
    await connectDB( process.env.MONGO_URI );

    app.listen( port, () =>
      console.log( `Server is listening on port ${ port }...` )
    );
  } catch ( error )
  {
    console.log( error );
  }
};

start();
