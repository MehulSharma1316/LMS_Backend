const express = require('express');
const bodyParser = require('body-parser');
const { connectToDatabase } = require('../Config/Db');
const licenseRoute = require("../routes/licenseRoute")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sendLicenseAlerts = require('../controllers/sendLicenseAlerts')
const cron = require('node-cron');
const path = require("path");
// const licenseRoutes = require('./routes/licenseRoutes');

const app = express();
require('dotenv').config()

// Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    credentials: true,
    methods: "GET,POST,PUT,DELETE", // Specify allowed methods
    allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
  })
);

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// Connect to the database
connectToDatabase();

// Use license routes
app.use('/api/v1', licenseRoute);




// Start the server
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Start cron job
// cron.schedule('0 8 * * *', () => {
//   console.log("Scheduled job triggered at 8 AM");
//   sendLicenseAlerts();
// });  // This will schedule the daily cron job
// sendLicenseAlerts();