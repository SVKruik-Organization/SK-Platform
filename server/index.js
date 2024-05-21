const express = require('express');
const path = require('path');
const { deploymentAuthentication } = require('./middleware');
const { deployApplication } = require('./deploy');
const app = express();
require('dotenv').config()
const port = process.env.PORT;

// Status
app.get("/api/status", deploymentAuthentication, (req, res) => {
    res.json({ "status": "Online" });
});

// Deployment
app.post("/api/deploy", deploymentAuthentication, (req, res) => {
    deployApplication(res);
});

// Serve Vue Build
app.use(express.static(path.join(__dirname, 'dist')));

// Catch All
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start
app.listen(port, () => {
    console.log(`Serving Bot Website on port ${port}.`);
});
