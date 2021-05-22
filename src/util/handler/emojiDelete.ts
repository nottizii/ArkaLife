import { GuildEmoji, MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "emojiDelete",
    run: async (emoji: GuildEmoji) => {
        let author = await emoji.fetchAuthor()
        let client = emoji.client
        let embed = new MessageEmbed()
        .setTitle("Emoji Eliminado")
        .setDescription(d.toUTCString())
        .addField("Información:", `Nombre: ${emoji.name} \nID: ${emoji.id}\nAnimado?:${emoji.animated ? 'Si' : 'No'} \nIdentificador: \`${emoji.identifier}\``)
        .setImage(emoji.url)
        client.logs?.send(embed)
    }
}