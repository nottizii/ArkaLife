import { Message, Client, MessageEmbed } from 'discord.js'


module.exports = {
    name: "queue",
    aliases: [],
    run: async (client: Client, message: Message, args) => {
        let queue = client.distube.getQueue(message)
        const embed = new MessageEmbed()
        .setTitle("Cola de reproducción actual:")
        .setDescription(
            queue.songs.map((song, id) =>
            `**${id+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
        ).join("\n"))
        .setThumbnail(queue.songs[0].thumbnail)
        message.reply(embed)
    }
}