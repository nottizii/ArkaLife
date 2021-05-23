import { Message, Client } from 'discord.js'


module.exports = {
    name: "seek",
    aliases: [],
    run: async (client: Client, message: Message, args) => {
        if(!message.member.isDJ(message)) return message.reply(client.errors.makeEmbed("No eres DJ!"))
        if(!client.distube.isPlaying(message)) return message.reply(client.errors.makeEmbed("Nada reproduciendo!"))
    }
}