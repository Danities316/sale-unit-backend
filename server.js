const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { masterSequelize } = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const jsyaml = require('js-yaml');
const spec = fs.readFileSync('swagger.yaml', 'utf8');
const swaggerSpec = jsyaml.load(spec); // Import your Swagger specification

const app = express();
dotenv.config();

const tenantMiddleware = require('./src/middleware/tenantMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const businessRoutes = require('./src/routes/businnessRoutes');

// Test the master database connection
masterSequelize
  .authenticate()
  .then(() => {
    console.log('Master database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the master database:', err);
  });

const sessionStore = new MySQLStore({
  host: process.env.HOST,
  port: process.env.PORTS,
  user: process.env.USERNAMES,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  clearExpired: true, // Automatically remove expired sessions
  checkExpirationInterval: 900000, // How frequently expired sessions will be cleared (in milliseconds)
});

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    maxAge: 3600000, // Session expires in 1 hour
    secure: true, // Only transmit cookie over HTTPS
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
  })
);
app.use(express.json()); // Parse JSON requests
app.use(morgan('combined')); // Logging
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
); // Helmet for security headers
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes Define API routes here
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
