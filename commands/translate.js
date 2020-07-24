module.exports = {
    name: 'translate',
    description: 'translate previous message',
    execute(message, args) {
        // Module imports :
        const fs = require('fs');

        // Constants :
        const channel = message.channel;
        const file = './data.json';

        var words;
        try {
            // Get message just before command was run :
            channel.messages.fetch({ limit: 2 }).then(messages => {
                let lastMessage = messages.last().content.toLowerCase();
                let author = messages.last().author.toString();
                
                // Get data from data.json :
                data = JSON.parse(fs.readFileSync(file));
                words = data.words;
                let correctedMessage = lastMessage;

                // Compare message to data :
                for (const word of words) {
                    let expression = word.expression.toLowerCase();
                    let translation = word.translation.toLowerCase();

                    // Replace if necessary :
                    if (typeof lastMessage == 'string' && lastMessage.indexOf(expression) > -1) {
                        correctedMessage = lastMessage.replace(expression, translation);
                    }
                }
                
                // Send message in channel :
                channel.send(`${author} voulais dire : ${correctedMessage}`);
            }).catch(console.error);
        } catch (err) {
            console.log(err);
        }
    }
}