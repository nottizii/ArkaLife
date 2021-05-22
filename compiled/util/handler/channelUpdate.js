"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "channelUpdate",
    run: async (oldCh, newCh) => {
        let client = newCh.client;
        let logs = client.channels.cache.get('845436480570261554');
        let changes = [];
        if (oldCh.name !== newCh.name)
            return changes.push({ updated: 'Nombre', old: oldCh.name, newC: newCh.name });
        if (oldCh.permissionsLocked !== newCh.permissionsLocked)
            return changes.push({ updated: 'Permisos sincronizados', old: oldCh.permissionsLocked ? 'Si' : 'No', newC: newCh.permissionsLocked ? 'Si' : 'No' });
        if (oldCh.rawPosition !== newCh.rawPosition)
            return changes.push({ updated: 'Orden', old: oldCh.rawPosition, newC: newCh.rawPosition });
        if (oldCh.type !== newCh.type)
            return changes.push({ updated: 'Tipo', old: oldCh.type, newC: newCh.type });
        if (oldCh.viewable !== newCh.viewable && newCh.deleted)
            return changes.push({ updated: 'Mis permisos', old: oldCh.viewable ? 'Ver: Si' : 'Ver: No', newC: newCh.viewable ? 'Ver: Si' : 'Ver: No' });
        let e = new discord_js_1.MessageEmbed()
            .setTitle("Canal Actualizado!")
            .setDescription(d.toUTCString())
            .setFooter(":)")
            .setAuthor(newCh.guild.me.displayName, client.user.displayAvatarURL({ size: 512 }));
        changes.forEach(change => {
            e.addField(change.updated, change.old + ' => ' + change.newC);
        });
        return logs?.send(e);
    }
};
