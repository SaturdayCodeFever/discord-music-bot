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
                    message.channel.send(`Vous venez d'ajouter ${args[1]} à la liste d'attente, monsieur`);
                    queue.push(args[1])
                    play(connection, queue[0]);
                })
            }  
            
           break;
        case 'queue':
            message.channel.send(`La liste d'attente actuelle est composée des morceaux suivants: `);
            queue.forEach(song => {
                message.channel.send(`${song} - \n `);
            })
            break;
        default :
            break; 
    }

})

bot.login(config.bot_token);