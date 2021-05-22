"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "channelUpdate",
    run: async (guild, member) => {
        let client = guild.client;
        let embed = new discord_js_1.MessageEmbed()
            .setTitle("Miembro baneado")
            .setDescription(d.toUTCString())
            .addField("Información:", `Username: ${member.user.tag}\nID: ${member.id}`)
            .setThumbnail(member.user.displayAvatarURL());
        client.logs?.send(embed);
    }
};
