const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // console.log("inside authenticateToken");
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  // console.log("inside authenticateToken cooke is :-",req.cookies?.accessToken);
  // console.log("inside authenticateToken header is :-",req.header("Authorization")?.replace("Bearer ", ""));
        
        // console.log(req.cookies?.accessToken); 
        if (!token) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized request hai",
          });
        }

  // console.log("token",token);
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Token format: 'Bearer <token>'
    req.user = verified; // Add user info to the request object
    // console.log("verified",verified);
    next(); // Move to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    res.status(400).json({
      success: false,
      message: "Invalid Token",
    })
  }
};

module.exports = authenticateToken;
