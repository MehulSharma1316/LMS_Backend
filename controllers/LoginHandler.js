// const UserMaster = require("../Models/UserMaster")
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserMaster = require('../models/UserMaster');


// Function to Login user
exports.LoginHandler = async (req, res) => {
    try {
      // Get user ID from request object
    //   const userId = req.user.id
  
      // Get all required fields from request body
      const { username, password } = req.body;
 
    //  console.log("username, password",username, password);
  
      // Check if any of the required fields are missing
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        });
      }

    //   const user = await UserMaster.findOne({ username });

    const user = await UserMaster.findByUsername(username);

    console.log("user is",user);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      //compare user input password and bcrypt pasword from db
    //   const isPasswordMatch = await bcrypt.compare(password, user.password);
    //   if (!isPasswordMatch) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Invalid user credentials",
    //     });
    //   }

   
    console.log(`password is ${password} !== ${user.password}`);
      if (password !== user.password) {
        return res.status(400).json({
                  success: false,
                  message: "Invalid user credentials",
                });
      } 

      const accessToken = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Token expiration time
      });
    //   console.log("process.env.JWT_SECRET",process.env.JWT_SECRET);
      // console.log("token",token);
      
      const loggedInUser = await UserMaster.findByUsername(username);
      loggedInUser.password = ""
      console.log("loggedInUser",loggedInUser);

      const options = {
        httpOnly: true,
        secure: false, // Set to false since you're using HTTP
        sameSite: "lax" // Ensures cookies work across different origins
    }

      res.status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        data:  loggedInUser, accessToken, // Send the token to the client
        message: "User logged In Successfully",
      });

   

    } catch (error) {

      console.error(error)
      res.status(500).json({
        success: false,
        message: "incorect username or password",
        error: error.message,
      })
    }
  }


  exports.LogoutHandler = async(req, res) => {
    

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .json({
    success: true,
    data: {},
    message: "User logged Out"
  }
  )

  }


  
// // Function to ChangePassword
// exports.ChangePasswordHandler = async (req, res) => {
//   try {
//     // Get user ID from request object
//   //   const userId = req.user.id

//     // Get all required fields from request body
//     const { username, oldPassword, newPassword } = req.body;

   

//     // Check if any of the required fields are missing
//     if (!username || !oldPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "All Fields are Mandatory",
//       });
//     }

//     const user = await UserMaster.findOne({ username });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user credentials",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);


//     await UserMaster.findByIdAndUpdate({_id: user._id}, {password: hashedPassword }, { new: true })

//     // const accessToken = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
//     //   expiresIn: "1d", // Token expiration time
//     // });
//   //   console.log("process.env.JWT_SECRET",process.env.JWT_SECRET);
//     // console.log("token",token);
//     // const loggedInUser = await UserMaster.findById(user._id).select("-password -refreshToken")

//   //   const options = {
//   //     httpOnly: true,
//   //     secure: true
//   // }

//     res.status(200)
//     .json({
//       success: true,
//      data: {},
//       message: "Change Password Successfully",
//     });

 

//   } catch (error) {

//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "incorect username or password",
//       error: error.message,
//     })
//   }
// }

