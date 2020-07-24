module.exports = {
    name: 'update',
    description: 'update data file with spreadsheet info',
    execute(message, args) {
        // Required modules :
        const GoogleSpreadsheet = require('google-spreadsheet');
        const { promisify } = require('util');
        const fs = require('fs');

        // Get spreadsheet credentials :
        const creds = require('../google-credentials.json');

        // Main function :
        async function accessSpreadsheet() {
            // Connect to the spreadsheet :
            const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_TOKEN);
            await promisify(doc.useServiceAccountAuth)(creds);

            // Get all rows :
            const info = await promisify(doc.getInfo)();
            const sheet = info.worksheets[0];
            const rows = await promisify(sheet.getRows)({
                offset: 1
            });

            // Create an object to store data :
            var obj = {
                words: []
            };

            // For each row get data and append it to object :
            rows.forEach(row => {
                //printInfo(row);
                let expression = row.expression.toLowerCase();
                let translation = row.traduction.toLowerCase();

                obj.words.push({
                    expression: expression, 
                    translation: translation
                });
            });

            // Format object to JSON add write it to file :
            var json = JSON.stringify(obj);
            fs.writeFileSync('./data.json', json);
            console.log('data file created !');
        }

        // Run function :
        accessSpreadsheet();

        // Confirmation message :
        message.channel.send('Données mises à jour !');
    }
}