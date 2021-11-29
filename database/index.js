const { password } = require('./dbpassword.js');
const { Pool } = require('pg');

const dbConnection = new Pool({
  user: 'brettroberts',
  password: `${password}`,
  database: 'sdc',
  host: 'localhost',
  port: 5432,
});

module.exports = dbConnection;