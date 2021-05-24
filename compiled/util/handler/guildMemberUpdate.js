"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "guildMemberUpdate",
    run: async (oldM, newM) => {
        let client = newM.client;
        if (oldM.roles.cache === newM.roles.cache || oldM.displayName === newM.displayName)
            return;
        if (oldM.roles.cache !== newM.roles.cache) {
            let olddiff = oldM.roles.cache.filter(r => !newM.roles.cache.has(r.id));
            let newdiff = newM.roles.cache.filter(r => !oldM.roles.cache.has(r.id));
            //console.log(olddiff, newdiff)
            let oldstr = '';
            let newstr = '';
            olddiff.forEach(r => oldstr += r.toString() + " \n");
            newdiff.forEach(r => newstr += r.toString() + " \n");
            //console.log(oldstr, newstr)
            let embed = new discord_js_1.MessageEmbed()
                .setTitle("Roles actualizados!")
                .setDescription(d.toUTCString())
                .addFields([
                { name: "Miembro:", value: newM.toString(), inline: true },
                { name: "Antes:", value: oldstr + '\u200B', inline: true },
                { name: "Ahora:", value: newstr + '\u200B', inline: true }
            ])
                .setThumbnail(newM.user.displayAvatarURL());
            let logs = client.channels.cache.get('845436480570261554');
            logs?.send(embed);
        }
        if (oldM.displayName !== newM.displayName) {
            let e = new discord_js_1.MessageEmbed()
                .setTitle("Nombre actualizado!")
                .setThumbnail(newM.user.displayAvatarURL())
                .addFields([
                { name: "Antes", value: oldM.displayName ?? 'Sin cambios', inline: true },
                { name: "Ahora", value: newM.displayName ?? 'Sin cambios', inline: true }
            ]);
            let logs = client.channels.cache.get('845436480570261554');
            logs?.send(e);
        }
    }
};
