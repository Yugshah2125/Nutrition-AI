const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API KEY");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

const fs = require('fs');

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            fs.writeFileSync('models_list.json', JSON.stringify(json, null, 2));
            console.log("Written to models_list.json");
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Data:", data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
