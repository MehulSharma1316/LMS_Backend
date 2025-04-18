const axios = require('axios');
const { sql } = require('../Config/Db');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,  // Your email
      pass: process.env.EMAIL_PASS   // Your email password or app password
  }
});

// Function for send SMS alerts
exports.sendSMS_LicenseAlert = async (req, res) => {
    try {
        const { docId, siteName, license, validToDate, mobile, email } = req.body;
        
        // console.log("sendSMS_LicenseAlert docId",docId);
        const role = req.user.role;
       

        // if (role !== 'admin') {
        //     return res.status(403).send('Access denied. Only admins can send SMS licenses.');
        // }

        // const message = `Your license ${license} is expiring on ${validToDate}. Please renew it before the expiry date`
        
        // const mobileNo =  Number(mobile) 
        // console.log(`mobile is ${mobile} & msg is ${message}`);
        
        //  const message = `Your license ${license} is expiring on ${validToDate}. Please renew it before the expiry date`
         const message = `Your OPD is confirmed. Now you can collect your OPD Slip from Cancer Building Reception(41)
         For Any Query you can call us on 01662310201 -JIMS`
        //  const message = `Dear Sir/Mam,

        //  We would like to remind you that your license "${license.license}" is set to expire on ${license.validToDate}.
        //  To ensure uninterrupted service, please renew it before the expiration date.
        //  Kindly take the necessary steps to process the renewal at your earliest convenience. 
         
        //  Thank you for your prompt attention to this matter.
         
        //  System Generated Information
        //  JIMS`
        // const message = `hello`
     
      // const response = await axios.get(`https://www.smsjust.com/sms/user/urlsms.php?username=jindalinstitute&pass=jims@321&senderid=JIMSHS&dest_mobileno=${mobile}&message=${message}`);
  
      
  
      // if (response.status === 200) {
      //   console.log('Message sent successfully');
      // } else {
      //   console.error('Failed to send message status:', response.status);
      // }
        // console.log("res is :-", response);


        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
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

We would like to remind you that your license "${license}" is set to expire on ${validToDate}. To ensure uninterrupted service, please renew it before the expiration date.
          
If you have already initiated the renewal process, please disregard this email. However, if the renewal has been completed, kindly update the system with the new renewal entry for this particular license.
          
Thank you for your prompt attention to this matter.
          
System Generated Information
JIMS`
      };

      await transporter.sendMail(mailOptions);
      console.log(`Alert sent to ${license.email} for license ${license.license}`);
        res.status(200).json({
            success: true,
            message: "License SMS Send successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error While Sending SMS');
    }
};
