import { GuildMember, MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "guildMemberRemove",
    run: async (member: GuildMember) => {
        let client = member.client
        let embed = new MessageEmbed()
        .setTitle("Usuario Eliminado")
        .setDescription(d.toUTCString())
        .setThumbnail(member.user.displayAvatarURL())
        .addField(`Datos:`, `\nID: ${member.id}\nUsername:${member.user.tag}`)
        client.logs?.send(embed)
    }
}