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
const config = JSON.parse(fs.readFileSync("./config.json"));
const client = new Discord.Client();
const jarvis = new JarvisBot(config.prefix);

client.on('ready', () => {});

client.on('message', jarvis.commandHandler);

client.login(config.bot_token);