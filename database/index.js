const { Pool } = require('pg');

const dbConnection = new Pool({
  user: 'brettroberts',
  password: `brob2010`,
  database: 'sdc',
  host: 'localhost',
  port: 5432,
});

module.exports = dbConnection;