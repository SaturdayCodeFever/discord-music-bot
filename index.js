const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const bot = new Discord.Client();
const config = JSON.parse(fs.readFileSync("./config.json"));

bot.on('ready', () => {
    console.log("Jarvis ONLINE");

    let queue = [];
});

bot.on('message', message => {
    let args = message.content.substring(config.prefix.length).split(" ");

    switch(args[0]) {
        case 'play':
            const play = (connection, url) => {
                 let dispatcher = connection.play(ytdl(url, {
                     filter: "audioonly"
                 }))
                 
                 dispatcher.on("end", () => {
                    connection.disconnect()
                 })
            }

            if(!args[1]) {
                message.channel.send("Je ne peut rien faire sans lien, monsieur");
                return;
            }

            if(!message.member.voice.channel) {
                message.channel.send("Pourriez-vous rejoindre un channel vocal avant, monsieur ?");
                return;
            }

            if(!message.guild.voiceConnection) {
                message.member.voice.channel.join()
                .then(connection => {
                    play(connection, args[1]);
                })
            }  
            
           break;
        default :
            break; 
    }

})

bot.login(config.bot_token);