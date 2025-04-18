const License = require("../models/License");

// Function to create a new License
exports.createLicense = async (req, res) => {
    try {

        const createdBy = req.user.username
        if(
            !createdBy
        ){
            return res.status(400).json({
                success: false,
                message: "createdBy are Mandatory Field",
            });
        }
        const newLicense = new License({ ...req.body, createdBy });
        newLicense.createdBy = req.user.username
        // console.log("req in createl",newLicense);
        // Check if any of the required fields are missing
        if (
            !newLicense.siteName ||
            !newLicense.category ||
            !newLicense.license ||
            !newLicense.regNo ||
            !newLicense.authority ||
            !newLicense.issueDate ||
            !newLicense.validToDate ||
            !newLicense.responsible ||
            !newLicense.email ||
            !newLicense.fileNo ||
            newLicense.alertDays === undefined || newLicense.alertDays === null || isNaN(newLicense.alertDays) ||
            !newLicense.createdAt ||
            !newLicense.updatedAt 
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }
        
        // Try to create the License entry in the database
        await License.create(newLicense);

        res.status(200).json({
            success: true,
            data: {},
            message: "License created successfully",
        });
    } catch (error) {
        console.error("Error creating license:", error);
        
        // Check for EPARAM or any validation error and send a 400 status with error message
        if (error.code === 'EPARAM') {
            return res.status(400).json({
                success: false,
                message: "Validation error: Invalid data for one or more fields.",
                error: error.message,
            });
        }

        // Handle any other SQL or general errors
        return res.status(500).json({
            success: false,
            message: "Failed to save License",
            error: error.message,
        });
    }
};


exports.getAllLicense = async(req, res) => {
    try {
        const license = await License.findAllLicense()
        
        res.status(200).json({
            success: true,
            data: license,
            message: "Get all License successfully",
          })
    } catch (error) {
        console.error(error)
        res.status(500).json({
          success: false,
          message: "Failed to get License",
          error: error.message,
        })
    }
}
