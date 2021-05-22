import { MessageEmbed, Guild, GuildMember } from "discord.js";
let d = new Date()

module.exports = {
    name: "channelUpdate",
    run: async (guild: Guild, member: GuildMember) => {
        let client = guild.client
        let embed = new MessageEmbed()
        .setTitle("Miembro baneado")
        .setDescription(d.toUTCString())
        .addField("Información:", `Username: ${member.user.tag}\nID: ${member.id}`)
        .setThumbnail(member.user.displayAvatarURL())
        client.logs?.send(embed)
    }
}