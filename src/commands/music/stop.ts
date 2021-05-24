import { Message, Client, MessageEmbed } from 'discord.js'


module.exports = {
    name: "stop",
    aliases: [],
    run: async (client: Client, message: Message, args) => {
        if(!message.member.isDJ(message)) return message.reply(client.errors.makeEmbed('No eres un DJ!'))
        if(!client.distube.isPlaying(message)) return message.reply(client.errors.makeEmbed('Nada reproduciendo!'))
        client.distube.stop(message)
        message.reply(new MessageEmbed().setColor("GREEEN").setDescription("Reproducción detenida!"))
    }
}