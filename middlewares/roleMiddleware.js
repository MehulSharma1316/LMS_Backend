const authorizeRole = (requiredRole) => {

  return (req, res, next) => {

    if (req.user.role !== requiredRole) {

      console.log("Access Denied: Insufficient Permissions");
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }

    console.log("access granted");
    next();
  };
};

module.exports = authorizeRole;
