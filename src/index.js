/**
 * IMPORTS :
 *      Discord - package consuming the discord API
 *      fs - nodejs standard file system package
 */
const Discord = require('discord.js');
const JarvisBot = require('./JarvisBot/JarvisBot')
const fs = require('fs');

/**
 *  INSTANCES :
 */
const config = JSON.parse(fs.readFileSync("./static/config.json"));
const client = new Discord.Client();
const jarvis = new JarvisBot(config.prefix);

client.on('ready', () => {
    console.log('JARVIS ONLINE')
});

client.on('message', (message) => jarvis.commandHandler(message));

client.login(config.bot_token);