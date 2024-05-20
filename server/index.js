const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()
const port = process.env.PORT;

// Status
app.get("/status", (req, res) => {
    res.json({ "status": "Online" });
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
