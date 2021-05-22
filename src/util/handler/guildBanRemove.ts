import { MessageEmbed, Guild, GuildMember, User } from "discord.js";
let d = new Date()

module.exports = {
    name: "channelUpdate",
    run: async (guild: Guild, member: User) => {
        let client = guild.client
        let embed = new MessageEmbed()
        .setTitle("Miembro des-baneado")
        .setDescription(d.toUTCString())
        .addField("Información:", `Username: ${member.tag}\nID: ${member.id}`)
        .setThumbnail(member.displayAvatarURL())
        client.logs?.send(embed)
    }
}