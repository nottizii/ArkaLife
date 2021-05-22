"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "channelCreate",
    run: async (channel) => {
        let client = channel.client;
        let e = new discord_js_1.MessageEmbed()
            .setTitle("Canal Creado!")
            .setDescription(d.toUTCString())
            .addField("Tipo:", channel.type, true)
            .addField("Nombre:", channel.name, true)
            .addField("Link rapido:", channel.toString)
            .setFooter(":)")
            .setAuthor(channel.guild.me.displayName, client.user.displayAvatarURL({ size: 512 }));
        return client.logs?.send(e);
    }
};
