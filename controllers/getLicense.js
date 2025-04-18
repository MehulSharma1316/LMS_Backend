

const {sql} = require('../Config/Db')
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

require('dotenv').config();




exports.getLicense = async (req, res) => {
    try {
        const { fromDate, toDate, siteCode, status } = req.body;
        const pool = await sql.connect();    
        
        const createdBy = req.user.username
        const role = req.user.role
        
        
        // Construct the base query
        let query = `
            SELECT 
                docId,
                siteName,
                category,
                license,
                regNo,
                authority,
                FORMAT(issueDate, 'dd-MM-yyyy') AS issueDate,
                FORMAT(validToDate, 'dd-MM-yyyy') AS validToDate,
                responsible,
                email,
                fileNo,
                FORMAT(createdAt, 'dd-MM-yyyy HH:mm:ss') AS createdAt,
                FORMAT(updatedAt, 'dd-MM-yyyy HH:mm:ss') AS updatedAt,
                alertDays,
                createdBy,
                mobile,
                discard,
                modifiedBy
            FROM License
            WHERE validToDate BETWEEN @fromDate AND @toDate
            
        `;

        // If the user role is user, filter by createdBy
        if (role === "user") {
            query += ` AND createdBy = @createdBy`;
        }

        // If siteCode is not 'ALL', add the siteName filter
        if (siteCode !== "ALL") {
            query += ` AND siteName = @siteCode`;
        }

        query += ` ORDER BY discard ASC, updatedAt DESC`;

        // Prepare the request
        let request = pool.request()
            .input('fromDate', sql.Date, fromDate)
            .input('toDate', sql.Date, toDate);

            // If the user is not an admin, bind the @createdBy parameter
        if (role === "user") {
            request = request.input('createdBy', sql.VarChar, createdBy);
        }

        // If siteCode is not 'ALL', bind the @siteCode parameter
        if (siteCode !== "ALL") {
            request = request.input('siteCode', sql.VarChar, siteCode);
        }

        // Execute the query
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).send('No data found for the given criteria.');
        }

         // Get today's date
         const todayDate = new Date();
         const date = todayDate.toISOString().split('T')[0]

         // Add "Status" field to each record
         let  modifiedData = result.recordset.map(item => {
             const formattedValidToDate = new Date(item.validToDate.split('-').reverse().join('-')); // Convert dd-MM-yyyy to Date
             const validDate = formattedValidToDate.toISOString().split('T')[0]
            //  console.log(` ${formattedValidToDate} < ${todayDate} `);
            //  console.log(` ${validDate} < ${date} `);
             return {
                 ...item,
                 Status: item.discard === 1 
                     ? "Discard" 
                     : validDate < date 
                         ? "Expired" 
                         : "Active"
             };
         });

          // Apply status filter if not "ALL"
        if (status && status !== "ALL") {
            modifiedData = modifiedData.filter(item => item.Status === status);
        }

        res.status(200).json({
            success: true,
            data: modifiedData,
            message: "Get all License successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



// Function for license Export To Excel
exports.licenseExportToExcel  = async (req, res) => {
    try {

        
        const { fromDate, toDate, siteCode, status } = req.body;
        const pool = await sql.connect();     

        const createdBy = req.user.username;
        const role = req.user.role;


        
        // console.log(`createdBy is ${createdBy} & role is ${role}`);
        // Construct the base query
        let query = `
            SELECT 
                docId,
                siteName,
                category,
                license,
                regNo,
                authority,
                FORMAT(issueDate, 'dd-MM-yyyy') AS issueDate,
                FORMAT(validToDate, 'dd-MM-yyyy') AS validToDate,
                responsible,
                email,
                fileNo,
                mobile,
                alertDays,
                createdBy,
                modifiedBy,
                FORMAT(createdAt, 'dd-MM-yyyy HH:mm:ss') AS createdAt,
                FORMAT(updatedAt, 'dd-MM-yyyy HH:mm:ss') AS updatedAt,
                discard
            FROM License
            WHERE validToDate BETWEEN @fromDate AND @toDate
        `;

        // If the user role is "user", filter by createdBy
        if (role === "user") {
            query += ` AND createdBy = @createdBy`;
        }

        // If siteCode is not 'ALL', add the siteName filter
        if (siteCode !== "ALL") {
            query += ` AND siteName = @siteCode`;
        }

        query += ` ORDER BY discard ASC, updatedAt DESC`;
        // Prepare the request
        let request = pool.request()
            .input('fromDate', sql.Date, fromDate)
            .input('toDate', sql.Date, toDate);


        // If the user role is "user", bind the @createdBy parameter
        if (role === "user") {
            request = request.input('createdBy', sql.VarChar, createdBy);
        }
        // If siteCode is not 'ALL', bind the @siteCode parameter
        if (siteCode !== "ALL") {
            request = request.input('siteCode', sql.VarChar, siteCode);
        }

        // console.log("query is ",query);

        // Execute the query
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).send('No data found for the given criteria.');
        }

// ***************************************** structure data with map ***************************

// const todayDate = new Date().toISOString().split('T')[0];
const todayDate = new Date(); // Today's date
const date = todayDate.toISOString().split('T')[0]



let data = await Promise.all(result.recordset.map(async (item, index) => {
    // Convert item.validToDate from "dd-mm-yyyy" to "YYYY-MM-DD" for comparison
    const formattedValidToDate = new Date(item.validToDate.split('-').reverse().join('-'));
            // console.log(`${todayDate} = ${formattedValidToDate}`);
            const validDate = formattedValidToDate.toISOString().split('T')[0]
            const resultData = {
                "SiteName" : item.siteName,
                "Category": item.category,
                "License" : item.license,
                "Registration" : item.regNo,
                "Issuing Authority" : item.authority,
                "Date of Issue" : item.issueDate,
                "Valid up to Date" : item.validToDate,
                "Person Responsible Name" : item.responsible,
                "Email" : item.email,
                "File No." : item.fileNo,
                "Mobile": item.mobile,
                "alertDays" : item.alertDays,
                "createdBy" : item.createdBy,
                "createdAt" : item.createdAt,
                "modifiedBy" : item.modifiedBy,
                "modifiedAt" : item.updatedAt,
                
                "Status": item.discard === 1 
                ? "Discard" 
                : validDate < date 
                ? "Expired" 
                : "Active",
                


            }
            return resultData
        }))

          // Apply status filter if not "ALL"
          if (status && status !== "ALL") {
            data = data.filter(item => item.Status === status);
        }

        // console.log("path :-",__dirname)
        // Convert result to Excel format
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

       
    
        // Write the workbook to a buffer
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    
        // Send the Excel file to the client
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
        
       await  res.send(buffer);
      //  await pool.close();
    } catch (error) {

      console.error(error)
      res.status(500).send('Internal Server Error');
    }
  }


 // for update License data
  exports.updateLicense = async (req, res) => {
    try {
        const { docId, siteName, category, license, regNo, authority, issueDate, validToDate, responsible, email, mobile, fileNo, alertDays } = req.body;
        const pool = await sql.connect();
        
        const modifiedBy = req.user.username;
        const updatedAt = new Date();

        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        let query = `
            UPDATE License
            SET 
                siteName = @siteName,
                category = @category,
                license = @license,
                regNo = @regNo,
                authority = @authority,
                issueDate = @issueDate,
                validToDate = @validToDate,
                responsible = @responsible,
                email = @email,
                fileNo = @fileNo,
                mobile = @mobile,
                alertDays = @alertDays,
                modifiedBy = @modifiedBy,
                updatedAt = @updatedAt
            WHERE docId = @docId
            AND discard <> '1'
            AND validToDate >= @today
        `;

        let request = pool.request()
            .input('docId', sql.Int, docId)
            .input('siteName', sql.VarChar, siteName)
            .input('category', sql.VarChar, category)
            .input('license', sql.VarChar, license)
            .input('regNo', sql.VarChar, regNo)
            .input('authority', sql.VarChar, authority)
            .input('issueDate', sql.Date, issueDate)
            .input('validToDate', sql.Date, validToDate)
            .input('responsible', sql.VarChar, responsible)
            .input('email', sql.VarChar, email)
            .input('mobile', sql.VarChar, mobile)
            .input('fileNo', sql.VarChar, fileNo)
            .input('alertDays', sql.Int, alertDays)
            .input('modifiedBy', sql.VarChar, modifiedBy)
            .input('updatedAt', sql.DateTime, updatedAt)
            .input('today', sql.DateTime, today);

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('No record found with the given ID.');
        }

        res.status(200).json({
            success: true,
            message: "License updated successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


// Discard License (Only for Admin Users)
exports.discardLicense = async (req, res) => {
    try {
        const { docId } = req.body;
        const pool = await sql.connect();
        // console.log("discardLicense docId",docId);
        const role = req.user.role;
        const modifiedBy = req.user.username;
        const updatedAt = new Date();

        if (role !== 'admin') {
            return res.status(403).send('Access denied. Only admins can discard licenses.');
        }

        let query = `
            UPDATE License
            SET 
                discard = 1,
                modifiedBy = @modifiedBy,
                updatedAt = @updatedAt
            WHERE docId = @docId
        `;

        let request = pool.request()
            .input('docId', sql.Int, docId)
            .input('modifiedBy', sql.VarChar, modifiedBy)
            .input('updatedAt', sql.DateTime, updatedAt);

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('No record found with the given ID.');
        }

        res.status(200).json({
            success: true,
            message: "License discarded successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
