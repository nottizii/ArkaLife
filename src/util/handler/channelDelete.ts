import { MessageEmbed, GuildChannel } from "discord.js";
let d = new Date()

module.exports = {
    name: "channelDelete",
    run: async (channel: GuildChannel) => {
        let client = channel.client
        let e = new MessageEmbed()
        .setTitle("Canal eliminado!")
        .setDescription(d.toUTCString())
        .addField("Tipo:", channel.type, true)
        .addField("Nombre:", channel.name, true)
        .addField("ID:", channel.id)
        .setFooter(":)")
        .setAuthor(channel.guild.me.displayName, client.user.displayAvatarURL({ size: 512 }))
        return client.logs?.send(e)
    }
}