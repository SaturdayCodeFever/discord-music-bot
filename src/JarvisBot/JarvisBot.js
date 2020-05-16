/**
 * IMPORTS :
 *      ytdl-core : handles youtube link streaming
 */
const ytdl = require('ytdl-core')
 /**
  * INSTANCES :
  *     HANDLED_COMMANDS - Data object containing all the handled commands
  */
const HANDLED_COMMANDS = require('Commands.js')


/**
 *  Class containing all the bot logic
 */
class JarvisBot {
    constructor(prefix) {
        this.prefix = prefix;
    } 

    //applies the correct logic to the command, based on HANDLED_COMMANDS
    commandHandler(message) {
        let args = message.content.substring(this.prefix.length).split(" ");
        let command = args[0]


        if(Object.values(HANDLED_COMMANDS).includes(command)) {
            if(Object.values(HANDLED_COMMANDS.MUSIC_COMMANDS).includes(command)) {
                switch (command) {
                    case HANDLED_COMMANDS.MUSIC_COMMANDS.PLAY:
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
                                this.play(connection, args[1])
                            })
                        } else {
                            this.play(message.guild.voiceConnection, args[1])
                        }

                        break;
                    case HANDLED_COMMANDS.MUSIC_COMMANDS.PAUSE:
                        break;
                    case HANDLED_COMMANDS.MUSIC_COMMANDS.STOP:
                        break;
                }
            }
        } else {
            message.channel.send("Désolé monsieur, cela ne fait pas parti de mes fonctionnalités. Entrez !help pour plus d'informations.");
        }
    }

    //Start streaming a youtube url link
    play(connection, url) {
        let dispatcher = connection.play(ytdl(url, {
            filter: "audioonly"
        }))
        
        dispatcher.on("end", () => {
           connection.disconnect()
        })
    }
}

module.exports = JarvisBot