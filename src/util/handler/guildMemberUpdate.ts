import { GuildMember, MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "guildMemberUpdate",
    run: async (oldM: GuildMember, newM: GuildMember) => {
        if(oldM.roles.cache !== newM.roles.cache) return;
        let olddiff = oldM.roles.cache.filter(r => !newM.roles.cache.has(r.id))
        let newdiff = newM.roles.cache.filter(r => !oldM.roles.cache.has(r.id))

        let oldstr;
        let newstr;

        olddiff.forEach(r => oldstr += r.toString())
        newdiff.forEach(r => newstr += r.toString() + " \n")
        let embed = new MessageEmbed()
        .setTitle("Roles actualizados!")
        .setDescription(d.toUTCString())
        .addFields([
            { name: "Miembro:", value: newM.toString, inline: true},
            { name: "Antes:", value: oldstr, inline: true},
            { name: "Ahora:", value: oldstr, inline: true}
        ])
        .setThumbnail(newM.user.displayAvatarURL())
        newM.client.logs?.send(embed)
    }
}