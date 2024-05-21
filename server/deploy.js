const shell = require("shelljs");

function deployApplication(res) {
    shell.exec('sh deploy.sh', (code, stdout, stderr) => {
        if (code !== 0) {
            res.json({ "status": `Shell Error ${code}` });
        } else res.json({ "status": "Received" });
    });
}

module.exports = {
    "deployApplication": deployApplication
}