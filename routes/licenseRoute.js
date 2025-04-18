const express = require('express');
const authenticateToken = require("../middlewares/authMiddleware")
const router = express.Router();

const {createLicense} = require("../controllers/createLicense")
const {createUser} = require("../controllers/createUser")
const {LoginHandler} = require("../controllers/LoginHandler")
const {LogoutHandler} = require("../controllers/LoginHandler")
const {findUsername} = require("../controllers/createUser")
const {changePassword} = require("../controllers/changePassword")
const {getAllLicense} = require("../controllers/createLicense")
const {getLicense} = require('../controllers/getLicense')
const {licenseExportToExcel} = require('../controllers/getLicense')
const {updateLicense} = require('../controllers/getLicense')
const {discardLicense} = require('../controllers/getLicense')
const {sendSMS_LicenseAlert} = require('../controllers/sendSMS_LicenseAlert')

router.post("/createLicense",authenticateToken, createLicense);
router.post("/createUser", authenticateToken, createUser);
router.post("/LoginHandler", LoginHandler);
router.post("/LogoutHandler", LogoutHandler);
router.post("/changePassword", changePassword);
router.post("/getLicense",authenticateToken, getLicense);
router.post("/licenseExportToExcel", authenticateToken, licenseExportToExcel);
router.put("/updateLicense", authenticateToken, updateLicense);
router.post("/discardLicense", authenticateToken, discardLicense);
router.post("/sendSMS_LicenseAlert",authenticateToken, sendSMS_LicenseAlert);
router.get("/findUsername", findUsername);
router.get("/getAllLicense",authenticateToken, getAllLicense);
router.get("/auth/check", authenticateToken, (req, res) => {
    // console.log("indide this");
    const role = req.user.role
    // console.log("role",role);
    res.status(200).json({success: true, data: {role: role}, message: "Welcome to your dashboard" });
  } )
  router.get("/user", authenticateToken, (req, res) => {
    
    const role = req.user.role
    // console.log("role",role);
    res.status(200).json({data: {success: true, role: role }, message: "Welcome to your dashboard" });
  } )

module.exports = router