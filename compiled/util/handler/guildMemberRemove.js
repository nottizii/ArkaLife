"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "guildMemberRemove",
    run: async (member) => {
        let client = member.client;
        let embed = new discord_js_1.MessageEmbed()
            .setTitle("Usuario Eliminado")
            .setDescription(d.toUTCString())
            .setThumbnail(member.user.displayAvatarURL())
            .addField(`Datos:`, `\nID: ${member.id}\nUsername:${member.user.tag}`);
        client.logs?.send(embed);
    }
};
