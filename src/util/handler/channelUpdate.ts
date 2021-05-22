import { MessageEmbed, GuildChannel } from "discord.js";
let d = new Date()

module.exports = {
    name: "channelUpdate",
    run: async (oldCh: GuildChannel, newCh: GuildChannel) => {
        let client = newCh.client
        let changes = []
        if(oldCh.name !== newCh.name) return changes.push({ updated: 'Nombre', old: oldCh.name, newC: newCh.name })
        if(oldCh.parent !== newCh.parent) return changes.push({ updated: 'Categoría', old: oldCh.parent.name, newC: newCh.parent.name })
        if(oldCh.permissionsLocked !== newCh.permissionsLocked) return changes.push({ updated: 'Permisos sincronizados', old: oldCh.permissionsLocked ? 'Si' : 'No', newC: newCh.permissionsLocked ? 'Si' : 'No' })
        if(oldCh.rawPosition !== newCh.rawPosition) return changes.push({ updated: 'Orden', old: oldCh.rawPosition, newC: newCh.rawPosition })
        if(oldCh.type !== newCh.type) return changes.push({ updated: 'Tipo', old: oldCh.type, newC: newCh.type })
        if(oldCh.viewable !== newCh.viewable && newCh.deleted) return changes.push({ updated: 'Mis permisos', old: oldCh.viewable ? 'Ver: Si' : 'Ver: No', newC: newCh.viewable  ? 'Ver: Si' : 'Ver: No'})
        let e = new MessageEmbed()
        .setTitle("Canal Actualizado!")
        .setDescription(d.toUTCString())
        .setFooter(":)")
        .setAuthor(newCh.guild.me.displayName, client.user.displayAvatarURL({ size: 512 }))
        changes.forEach(change => {
            e.addField(change.updated, change.old + ' => ' + change.new)
        })
        client.logs?.send(e)
    }
}