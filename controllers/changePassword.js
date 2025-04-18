const {sql} = require('../Config/Db')
const UserMaster = require('../models/UserMaster')


exports.changePassword = async (req, res) => {
    try {
      const { username, oldPassword, newPassword } = req.body;
  
      // Validate input fields
      if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Username, Old Password, and New Password are required.",
        });
      }
  
      // Connect to the database
      const pool = await sql.connect();
      const request = pool.request();
  
      // Check if the user exists and get the current password
    //   request.input("username", sql.VarChar, username);
    //   const result = await request.query("SELECT password FROM UserMaster WHERE username = @username");
    const user = await UserMaster.findByUsername(username)
      // console.log("user is",user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
  
    //   const user = result.recordset[0];
  
      // Verify old password (assuming passwords are stored as plain text)
      if (user.password !== oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect.",
        });
      }
  
      // Update the password
      request.input("newPassword", sql.VarChar, newPassword);
      request.input("username", sql.VarChar, username);
      await request.query("UPDATE UserMaster SET password = @newPassword WHERE username = @username");
  
      return res.status(200).json({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({
        success: false,
        message: "Failed to change password.",
        error: error.message,
      });
    }
  };
  