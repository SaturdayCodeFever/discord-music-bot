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
    } 

    //applies the correct logic to the command, based on HANDLED_COMMANDS
    async commandHandler(message) {
        if(message.author.bot) return;
        if(!message.content.startsWith(this.prefix)) return;

        let args = message.content.substring(this.prefix.length).split(" ");
        let command = args[0]

        if(Object.values(HANDLED_COMMANDS.MUSIC_COMMANDS).includes(command)) {
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

                    if(!message.member.voice.channel) {
                        message.channel.send("Pourriez-vous rejoindre un channel vocal avant, monsieur ?");
                        return;
                    }
                    
                    if(!message.guild.voiceConnection) {
                        this.connection = await message.member.voice.channel.join()
                    }
                    
                    
                    this.play(args[1])

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
           this.connection.disconnect()
        })
    }
}

module.exports = JarvisBot