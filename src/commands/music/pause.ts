import { Message, Client, MessageEmbed } from 'discord.js'


module.exports = {
    name: "pause",
    aliases: [],
    run: async (client: Client, message: Message, args) => {
        if(!message.member.isDJ(message)) return message.reply(client.errors.makeEmbed('No eres un DJ!'))
        if(!client.distube.isPlaying(message)) return message.reply(client.errors.makeEmbed('Nada reproduciendose!'))
        client.distube.pause(message)
        message.reply(new MessageEmbed().setColor("YELLOW").setDescription("Reproducción pausada!"))
    }
}