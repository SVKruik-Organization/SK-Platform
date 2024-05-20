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

// Start
app.listen(port, () => {
    console.log(`Serving Bot Website on port ${port}.`);
});
