const sql = require('mssql');

require('dotenv').config();
const config = {
  user: process.env.LMS_USER,
  password: process.env.LMS_PASS,
  server: process.env.LMS_HOSTNAME,
  database: process.env.LMS_DB_NAME,
  options: {
    encrypt: false, // Try setting this to false if the server does not require SSL
    trustServerCertificate: true, // Use only if necessary
    enableArithAbort: true, // Improves compatibility
  },
};

const connectToDatabase = async (retries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sql.connect(config);
      console.log('Connected to MSSQL');
      return; // Exit function after successful connection
    } catch (err) {
      console.error(`Database connection attempt ${attempt} failed:`, err);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.error('All connection attempts failed.');
      }
    }
  }
};

module.exports = { sql, connectToDatabase };
