import { GuildBan, TextChannel } from "discord.js";
import { MessageEmbed, Guild, GuildMember, User } from "discord.js";
let d = new Date()

module.exports = {
    name: "guildBanAdd",
    run: async(ban: GuildBan) => {
        let client = ban.client
        let member = ban.user
        let embed = new MessageEmbed()
        .setTitle("Miembro baneado")
        .setDescription(d.toUTCString())
        .addField("Información:", `Username: ${member.tag}\nID: ${member.id}`)
        .setThumbnail(member.displayAvatarURL())
        let logs = client.channels.cache.get('845436480570261554') as TextChannel
        logs?.send(embed)
    }
}