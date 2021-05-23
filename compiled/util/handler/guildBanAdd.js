"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "guildBanAdd",
    run: async (ban) => {
        let client = ban.client;
        let member = ban.user;
        let embed = new discord_js_1.MessageEmbed()
            .setTitle("Miembro baneado")
            .setDescription(d.toUTCString())
            .addField("Información:", `Username: ${member.tag}\nID: ${member.id}`)
            .setThumbnail(member.displayAvatarURL());
        let logs = client.channels.cache.get('845436480570261554');
        logs?.send(embed);
    }
};
