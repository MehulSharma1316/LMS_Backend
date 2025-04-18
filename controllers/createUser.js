const UserMaster = require('../models/UserMaster');




// Function to create a new License
exports.createUser = async (req, res) => {
    try {
        // const newLicense = new License(req.body);

        const newUser = new UserMaster(req.body);
  
        const isUserExist = await UserMaster.findByUsername(req.body.username)



        if(isUserExist) {
          res.status(500).json({
            success: false,
            message: "User alredy exist",
            error: error.message,
          })
        }
 
  
      // Check if any of the required fields are missing
    //   if (
    //     !reportName ||
    //     !toEmail ||
    //     !subject ||
    //     !messageBody ||
    //     !site ||
    //     !reportFilter ||
    //     !schedulerType ||
    //     !startDate ||
    //     !startTime ||
    //     !sqlQuery 
    //   ) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "All Fields are Mandatory",
    //     })
    //   }
      
    // console.log("newUser",newUser);

    await UserMaster.create(newUser);
    

      res.status(200).json({
        success: true,
        data: {},
        message: "User created successfully",
      })
    } catch (error) {

      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to save User",
        error: error.message,
      })
    }
  }


  exports.findUsername = async(req, res) => {
    try {
      const username = await UserMaster.findAllUsername()
      // console.log("username",username);

      res.status(200).json({
        success: true,
        data: username,
        message: "Get all username successfully",
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to get username",
        error: error.message,
      })
    }
  }