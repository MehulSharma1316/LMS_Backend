const { sql } = require('../Config/Db');

// Define License form schema
const License = function (licenseData) {
  // this.docId  = licenseData.docId;
  this.siteName = licenseData.siteName;
  this.license  = licenseData.license;
  this.category  = licenseData.category;
  this.regNo = licenseData.regNo ;
  this.authority = licenseData.authority ;
  this.issueDate = licenseData.issueDate ;
  this.validToDate = licenseData.validToDate ;
  this.responsible = licenseData.responsible;
  this.email = licenseData.email;
  this.fileNo  = licenseData.fileNo;
  this.alertDays = licenseData.alertDays;
  this.createdAt = licenseData.createdAt ? new Date(licenseData.createdAt) : new Date(); // Use provided date or default to current date
  this.updatedAt = licenseData.updatedAt ? new Date(licenseData.updatedAt) : new Date(); // Use provided date or default to current date
  this.createdBy = licenseData.createdBy;
  this.mobile = licenseData.mobile;
  this.modifiedBy = licenseData.modifiedBy;
  this.discard = licenseData.discard !== undefined ? licenseData.discard : 0; // Default to 0
};

// Method to insert a new license
License.create = async (newLicense) => {
  try {
    const pool = await sql.connect();
    const request = pool.request();

    request.input('siteName', sql.VarChar, newLicense.siteName);
    request.input('category', sql.VarChar, newLicense.category);
    request.input('license', sql.VarChar, newLicense.license);
    request.input('regNo', sql.VarChar, newLicense.regNo);
    request.input('authority', sql.VarChar, newLicense.authority);
    request.input('issueDate', sql.Date, newLicense.issueDate);
    request.input('validToDate', sql.Date, newLicense.validToDate);
    request.input('responsible', sql.VarChar, newLicense.responsible);
    request.input('email', sql.VarChar, newLicense.email);
    request.input('fileNo', sql.VarChar, newLicense.fileNo);
    request.input('alertDays', sql.Int, newLicense.alertDays);
    request.input('createdAt', sql.DateTime, newLicense.createdAt);
    request.input('updatedAt', sql.DateTime, newLicense.updatedAt);
    request.input('createdBy', sql.VarChar, newLicense.createdBy);
    request.input('mobile', sql.VarChar, newLicense.mobile);
    request.input('modifiedBy', sql.VarChar, newLicense.modifiedBy);
    request.input('discard', sql.Int, newLicense.discard); // Default to 0

    const query = `
      INSERT INTO License (siteName, category, license, regNo, authority, issueDate, validToDate, responsible, email, fileNo, alertDays, createdAt, updatedAt, createdBy, mobile , modifiedBy, discard)
      VALUES (@siteName, @category, @license, @regNo, @authority, @issueDate, @validToDate, @responsible, @email, @fileNo, @alertDays, @createdAt, @updatedAt, @createdBy, @mobile, @modifiedBy, @discard);
    `;
    
    const result = await request.query(query);
    // console.log('License Created:', result);
    return result;
  } catch (err) {
    console.error('Error creating license:', err);
    // Throw the error to be caught in createLicense.js
    throw err;
  }
};
// Method to find a license by ID
License.findById = async (licenseId) => {
  try {
    const pool = await sql.connect();
    const request = pool.request();
    request.input('id', sql.Int, licenseId);

    const result = await request.query('SELECT * FROM License WHERE id = @id');
    return result.recordset[0];
  } catch (err) {
    console.error('Error finding license:', err);
    // Throw the error to be caught in createLicense.js
    throw err;
  }
};


// Method to find all license 
License.findAllLicense = async () => {
  try {
    const pool = await sql.connect();
    const request = pool.request();
    // request.input('id', sql.Int, licenseId);

    const result = await request.query(`SELECT 
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
    modifiedBy,
      discard
FROM License;`);
    return result.recordset;
  } catch (err) {
    console.error('Error finding license:', err);
    // Throw the error to be caught in createLicense.js
    throw err;
  }
};

module.exports = License;
