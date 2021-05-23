import { TextChannel } from "discord.js";
import { GuildEmoji, MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "emojiUpdate",
    run: async (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => {
        let author = await oldEmoji.fetchAuthor()
        let client = oldEmoji.client
        let embed = new MessageEmbed()
        .setTitle("oldEmoji Actualizado")
        .setDescription(d.toUTCString())
        .addField("Información:", `Nombre: ${oldEmoji.name} => ${newEmoji.name}\nID: ${newEmoji.id}\nAnimado?:${newEmoji.animated ? 'Si' : 'No'} \nIdentificador: \`${newEmoji.identifier}\``)
        .setImage(newEmoji.url)
        let logs = client.channels.cache.get('845436480570261554') as TextChannel
        logs?.send(embed)
    }
}