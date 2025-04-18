const { sql } = require('../Config/Db');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your email
        pass: process.env.EMAIL_PASS   // Your email password or app password
    }
});

// Function to check and send alerts
const sendLicenseAlerts = async () => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        const pool = await sql.connect();
        const query = `
            SELECT email, license, FORMAT(validToDate, 'dd-MM-yyyy') AS validToDate, alertDays 
            FROM License
            WHERE 
                DATEADD(DAY, -alertDays, validToDate) <= @today  -- Alert start date
                AND DATEADD(DAY, +5, validToDate) >= @today  -- Ensure it's before expiry
                AND discard <> '1'
        `;

        const request = pool.request().input('today', sql.Date, today);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            console.log("No alerts to send today.");
            return;
        }

        // Send email alerts
        for (let license of result.recordset) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: license.email,
                subject: 'System Alert - License Expiry',
                // text: `Your license "${license.license}" is expiring on ${license.validToDate}. Please renew it before the expiry date.`
                // text: `Dear Sir/Mam,

                // We would like to remind you that your license "${license.license}" is set to expire on ${license.validToDate}.
                // To ensure uninterrupted service, please renew it before the expiration date.
                // Kindly take the necessary steps to process the renewal at your earliest convenience. 
                
                // Thank you for your prompt attention to this matter.
                
                // System Generated Information
                // JIMS`
                text: `Dear Sir/Mam,

We would like to remind you that your license "${license.license}" is set to expire on ${license.validToDate}. To ensure uninterrupted service, please renew it before the expiration date.
                          
If you have already initiated the renewal process, please disregard this email. However, if the renewal has been completed, kindly update the system with the new renewal entry for this particular license.
                          
Thank you for your prompt attention to this matter.
                          
System Generated Information
JIMS`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Alert sent to ${license.email} for license ${license.license}`);
        }

        

    } catch (error) {
        console.error("Error sending license alerts:", error);
    }
};

// Schedule the cron job to run daily at 8 AM use :- 0 8 * * *
// cron.schedule('0 8 * * *', sendLicenseAlerts);

module.exports = sendLicenseAlerts;
