const HANDLED_COMMANDS = require('Commands.js')

class JarvisBot {
    constructor(prefix) {
        this.prefix = prefix;
    } 

    commandHandler(message) {
        let args = message.content.substring(this.prefix.length).split(" ");


        if(Object.values(HANDLED_COMMANDS).includes(args[0])) {
            if(Object.values(HANDLED_COMMANDS.MUSIC_COMMANDS).includes(args[0])) {
                switch (args[1]) {
                    case HANDLED_COMMANDS.MUSIC_COMMANDS.PLAY:
                        break;
                    case HANDLED_COMMANDS.MUSIC_COMMANDS.PAUSE:
                        break;
                    case HANDLED_COMMANDS.MUSIC_COMMANDS.STOP:
                        break;
                    default :
                        message.channel.send("Je ne peut rien faire sans lien, monsieur.");
                        break;
                }
            }
        } else {
            message.channel.send("Desole monsieur, cela ne fait pas parti de mes fonctionnalitees. Entrez !help pour plus d'informations.");
        }
    }
}

module.exports = JarvisBot