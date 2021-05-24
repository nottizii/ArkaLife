import { TextChannel } from "discord.js";
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
        .addField(`Datos:`, `\nID: ${member.id}\nUsername: \`${member.user.tag}\``)
        let logs = client.channels.cache.get('845436480570261554') as TextChannel
        logs?.send(embed)
    }
}