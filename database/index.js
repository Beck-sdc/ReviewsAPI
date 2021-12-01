const { Pool } = require('pg');

const dbConnection = new Pool({
  user: 'postgres',
  password: `beck`,
  database: 'sdc',
  host: 'ENTER_DATABASE_IPV4_URL_HERE',
  port: 5432,
});

module.exports = dbConnection;