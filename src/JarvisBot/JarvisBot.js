/**
 * IMPORTS :
 *      ytdl-core : handles youtube link streaming
 */
const ytdl = require('ytdl-core')
/**
 * INSTANCES :
 *     HANDLED_COMMANDS - Data object containing all the handled commands
 */
const HANDLED_COMMANDS = require('./Commands.js')


/**
 *  Class containing all the bot logic
 */
class JarvisBot {
    constructor(prefix) {
        this.prefix = prefix;
        this.dispatcher;
        this.connection;
        this.queue = [];
    }

    //applies the correct logic to the command, based on HANDLED_COMMANDS
    commandHandler(message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(this.prefix)) return;

        let args = message.content.substring(this.prefix.length).split(" ");
        let command = args[0];

        if (Object.values(HANDLED_COMMANDS.MUSIC_COMMANDS).includes(command)) {
            switch (command) {
                case HANDLED_COMMANDS.MUSIC_COMMANDS.PLAY:
                    if(!args[1]) {
                        if(this.dispatcher.paused) {
                            this.dispatcher.resume();
                            return;
                        }
                      
                        message.channel.send("Je ne peut rien faire sans lien, monsieur");
                        return;
                    }

                    if (!message.member.voice.channel) {
                        message.channel.send("Pourriez-vous rejoindre un channel vocal avant, monsieur ?");
                        return;
                    }
                    
                    if(!message.guild.voiceConnection) {
                        this.connection = await message.member.voice.channel.join()
                    }

                    if (this.queue.length === 0) {
                        this.addSongToQueue(args[1], message).then(() => {
                            this.play(this.queue[0].url)
                        })
                    } else {
                        this.addSongToQueue(args[1], message);
                    }

                    break;
                case HANDLED_COMMANDS.MUSIC_COMMANDS.PAUSE:
                    if(!message.member.voice.channel) {
                        message.channel.send("Ceci ne vous regarde pas, monsieur")
                        return;
                    }

                    if(this.dispatcher) {
                        this.dispatcher.pause()
                        message.channel.send("Musique en Pause")
                    }

                    break;
                case HANDLED_COMMANDS.MUSIC_COMMANDS.STOP:
                    if(!message.member.voice.channel) {
                        message.channel.send("Ceci ne vous regarde pas, monsieur")
                        return;
                    }
                    //TODO : Vider la queue
                    this.dispatcher.end()
                    break;
                case HANDLED_COMMANDS.MUSIC_COMMANDS.QUEUE:
                    this.listQueue(message);
                    break;
            }
        } else {
            message.channel.send("Désolé monsieur, cela ne fait pas parti de mes fonctionnalités. Entrez !help pour plus d'informations.");
        }

        message.delete()
    }

    //Start streaming a youtube url link
    play(url) {        
        this.dispatcher = this.connection.play(ytdl(url, {
            filter: "audioonly",
        })
        )

        this.dispatcher.on("finish", () => {
            this.queue.shift();
            if (this.queue.length === 0) {
                this.connection.disconnect()
            } else {
                this.play(this.connection, this.queue[0].url);  
            }
        })
    }

    listQueue(message) {
        if (this.queue.length === 0) {
            message.channel.send("Il n'y a aucun titre en attente monsieur. Vous pouvez en ajouter avec la commande !play")
        } else {
            message.channel.send("Voici les titres en attente monsieur: ");
            this.queue.forEach(song => {
                message.channel.send(`- ${song.title}`);
            })
        }
    }

    //return song infos (title, url) of a youtube url link
    async addSongToQueue(url, message) {
        const songInfo = await ytdl.getInfo(url);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url
        }
        message.channel.send(`Le titre ${song.title} a été ajouté à la liste d'attente monsieur.`);
        this.queue.push(song);
    }
}

module.exports = JarvisBot