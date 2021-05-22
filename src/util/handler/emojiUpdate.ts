import { GuildEmoji, MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "emojiCreate",
    run: async (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => {
        let author = await oldEmoji.fetchAuthor()
        let client = oldEmoji.client
        let embed = new MessageEmbed()
        .setTitle("oldEmoji Actualizado")
        .setDescription(d.toUTCString())
        .addField("Información:", `Nombre: ${oldEmoji.name} => ${newEmoji.name}\nID: ${oldEmoji.id}\nAnimado?:${oldEmoji.animated ? 'Si' : 'No'} \nIdentificador: \`${oldEmoji.identifier}\``)
        .setImage(newEmoji.url)
        client.logs?.send(embed)
    }
}