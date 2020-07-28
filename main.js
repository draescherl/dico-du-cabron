// Module imports :
const discord = require('discord.js');
const fs = require('fs');

// Object creation :
const client = new discord.Client;
client.commands = new discord.Collection();

// Prefix used to call command :
const prefix = '-';

// Get all commands in commands/ folder :
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Log when the bot is ready
client.once('ready', () => {
    console.log('Bot is online !');
    client.user.setActivity('Essaie de comprendre Hugo ptn', { type: 'PLAYING' });
});

// Listen to messages :
client.on('message', message => {
    // Safety checks
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    // Get commands :
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    // Call correct command :
    switch (command) {
        case 'translate':
            client.commands.get('translate').execute(message, args);
            break;

        case 'update':
            client.commands.get('update').execute(message, args);
            break;
    
        default:
            break;
    }
});

// Bot login :
client.login(process.env.BOT_TOKEN);