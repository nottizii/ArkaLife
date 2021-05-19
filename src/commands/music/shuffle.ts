import { Message, Client, MessageEmbed } from 'discord.js'


module.exports = {
    name: "shuffle",
    aliases: [],
    run: async (client: Client, message: Message, args) => {
        if(!client.distube.isPlaying(message)) return message.reply(client.errors.makeEmbed('No hay nada reproduciendo!'));
        const q = await client.distube.shuffle(message)
        let songs = q.songs.join('\n')
        const e = new MessageEmbed()
        .setTitle("Lista Mezclada!")
        .setDescription(songs.slice(1000))
        message.reply(e)
    }
}