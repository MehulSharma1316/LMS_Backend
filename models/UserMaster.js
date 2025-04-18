const { sql } = require('../Config/Db'); // Import MSSQL connection from your db configuration

// Define UserMaster schema
const UserMaster = function (userData) {
  this.username = userData.username;
  this.password = userData.password;
  this.role = userData.role;
  this.description = userData.description;
  this.createdAt = new Date(); // Automatically set the creation date
  this.updatedAt = new Date(); // Automatically set the update date
};

// Method to insert a new user
UserMaster.create = async (newUser, result) => {
  try {
    const pool = await sql.connect(); // Connect to the database
    const request = pool.request(); // Create a request to run SQL queries

    // Set input parameters for the query
    request.input('username', sql.VarChar, newUser.username);
    request.input('password', sql.VarChar, newUser.password);
    request.input('role', sql.VarChar, newUser.role);
    request.input('description', sql.VarChar, newUser.description);
    request.input('createdAt', sql.DateTime, newUser.createdAt);
    request.input('updatedAt', sql.DateTime, newUser.updatedAt);

    // SQL query to insert a new user
    const query = `
      INSERT INTO UserMaster (username, password, role, description, createdAt, updatedAt)
      VALUES (@username, @password, @role, @description, @createdAt, @updatedAt);
    `;
    
    const result = await request.query(query); // Execute the query
    console.log('User Created: ', result); // Log the result
  } catch (err) {
    console.error('Error creating user:', err);
  }
};

// Method to find a user by username
UserMaster.findByUsername = async (username) => {
  try {
    const pool = await sql.connect();
    const request = pool.request();
    request.input('username', sql.VarChar, username);
    const result = await request.query('SELECT * FROM UserMaster WHERE username = @username');
    return result.recordset[0];
  } catch (err) {
    console.error('Error finding user by username:', err);
  }
};
// Method to find a user by username
UserMaster.findAllUsername = async () => {
  try {
    const pool = await sql.connect();
    const request = pool.request();
    
    const result = await request.query('SELECT username FROM UserMaster');
    console.log("result.recordset[0]",result.recordset);
    // const username = result.recordset.map((item, index) => {
    //   return item
    // })
    return result.recordset;
  } catch (err) {
    console.error('Error finding user by username:', err);
  }
};

module.exports = UserMaster;