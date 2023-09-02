const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./src/middleware/errorHandler');
const session = require('express-session');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const jsyaml = require('js-yaml');
const spec = fs.readFileSync('swagger.yaml', 'utf8');
const swaggerSpec = jsyaml.load(spec); // Import your Swagger specification
const app = express();
dotenv.config();

const tenantMiddleware = require('./src/middleware/tenantMiddleware');
const authRoutes = require('./src/routes/authRoutes');

// Require and use Swagger documentation
// require('./config/swagger-config')(app);

//Middleware
app.use(cors());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
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

console.log(
  'see data: ',
  process.env.DATABASE,
  process.env.USERNAMES,
  process.env.PASSWORD,
);

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

// just checking tabless
// sequelize
//   .getQueryInterface()
//   .showAllSchemas()
//   .then((tableObj) => {
//     console.log("// Tables in database", "==========================");
//     console.log(tableObj[3]);
//   })
//   .catch((err) => {
//     console.log("showAllSchemas ERROR", err);
//   });

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
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
