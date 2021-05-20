import { MessageEmbed } from "discord.js"

class ArkaLifeError extends Error {
    constructor(name:string, message:string) {
        super(message)
        this.name = name ?? 'ArkaLifeError'
    }
    
    makeEmbed(error:string):MessageEmbed {
        let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`❌ | Error: ${error}`)
        return embed;
    }
}

export = ArkaLifeError