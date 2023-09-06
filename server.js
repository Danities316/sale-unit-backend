const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const morgan = require('morgan');
<<<<<<< HEAD
=======
const errorHandler = require('./src/middleware/errorHandler');
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const fs = require('fs');
const { masterSequelize } = require('./config/database');
const errorHandler = require('./src/middleware/errorHandler');
=======

const fs = require('fs');
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
const swaggerUi = require('swagger-ui-express');
const jsyaml = require('js-yaml');
const spec = fs.readFileSync('swagger.yaml', 'utf8');
const swaggerSpec = jsyaml.load(spec); // Import your Swagger specification
<<<<<<< HEAD
=======
const app = express();
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
dotenv.config();

const tenantMiddleware = require('./src/middleware/tenantMiddleware');
const authRoutes = require('./src/routes/authRoutes');
<<<<<<< HEAD
const businessRoutes = require('./src/routes/businnessRoutes');
=======
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c

// Require and use Swagger documentation
// require('./config/swagger-config')(app);

<<<<<<< HEAD
// Test the master database connection
masterSequelize
  .authenticate()
  .then(() => {
    console.log(
      'Master database connection has been established successfully.',
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the master database:', err);
  });

const app = express();

=======
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
const sessionStore = new MySQLStore({
  host: process.env.HOST,
  port: process.env.PORTS,
  user: process.env.USERNAMES,
  password: process.env.PASSWORD,
<<<<<<< HEAD
  database: process.env.DATABASE,
  clearExpired: true, // Automatically remove expired sessions
=======
  database:  process.env.DATABASE,
 clearExpired: true, // Automatically remove expired sessions
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
  checkExpirationInterval: 900000, // How frequently expired sessions will be cleared (in milliseconds)
});

//Middleware
<<<<<<< HEAD
app.use(morgan('dev'));
app.use(cors());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    maxAge: 3600000, // // Session expires in 1 hour
    secure: true, // Only transmit cookie over HTTPS
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
  }),
);
=======
app.use(cors());
app.use(session({
    secret: process.env.JWT_SECRET,
    maxAge: 3600000, // // Session expires in 1 hour
    secure: true,    // Only transmit cookie over HTTPS
    resave: false,
    store: sessionStore,
    saveUninitialized: true
}));
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
// console.log("this is the session:, ", session)
app.use(express.json()); // Parse JSON requests
app.use(morgan('combined')); // Logging
app.use(
  helmet({
    contentSecurityPolicy: false,
    // {
    //   useDefaults: true,
    //   directives: {
    //     "script-src": ["'self'", "https://cdnjs.cloudflare.com/"],
    //   },
    // },
  }),
); // Helmet for security headers

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling middleware (must be defined after routes)
// app.use(errorHandler);

<<<<<<< HEAD
// // Create a Sequelize instance and test the database connection
// const sequelize = new Sequelize(
//   process.env.DATABASE,
//   process.env.USERNAMES,
//   process.env.PASSWORD,
//   {
//     host: process.env.HOST,
//     dialect: process.env.DIELECT,
//     port: process.env.PORTS,
//   },
// );

// // Test the database connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Database connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });

// Routes Define  API routes here
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
=======


// Create a Sequelize instance and test the database connection
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAMES,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIELECT,
    port: process.env.PORTS,
  },
);


// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Routes Define  API routes here
app.use('/api/auth', authRoutes);
>>>>>>> 719d2b9a5c100c52a16bac7aa5de4b2195b3760c
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
