"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "guildMemberUpdate",
    run: async (oldM, newM) => {
        if (oldM.roles.cache == newM.roles.cache || oldM.displayName == newM.displayName)
            return;
        let olddiff = oldM.roles.cache.filter(r => !newM.roles.cache.has(r.id));
        let newdiff = newM.roles.cache.filter(r => !oldM.roles.cache.has(r.id));
        let oldstr;
        let newstr;
        olddiff.forEach(r => oldstr += r.toString());
        newdiff.forEach(r => newstr += r.toString() + " \n");
        let embed = new discord_js_1.MessageEmbed()
            .setTitle("Roles actualizados!")
            .setDescription(d.toUTCString())
            .addFields([
            { name: "Miembro:", value: newM.toString, inline: true },
            { name: "Antes:", value: oldstr, inline: true },
            { name: "Ahora:", value: newstr, inline: true }
        ])
            .setThumbnail(newM.user.displayAvatarURL());
        newM.client.logs?.send(embed);
        if (oldM.displayName !== newM.displayName) {
            let e = new discord_js_1.MessageEmbed()
                .setTitle("Nombre actualizado!")
                .setThumbnail(newM.user.displayAvatarURL())
                .addFields([
                { name: "Antes", value: oldM.displayName, inline: true },
                { name: "Ahora", value: newM.displayName, inline: true }
            ]);
            newM.client.logs?.send(e);
        }
    }
};
