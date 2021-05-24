"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "messageDelete",
    run: async (message, client) => {
        message.client;
        const e = new discord_js_1.MessageEmbed()
            .setTitle("Mensaje eliminado!")
            .setDescription(d.toUTCString())
            .addField("Contenido:", message.content ?? "Error: No pude recuperar el contenido");
        let logs = client.channels.cache.get('845436480570261554');
        logs?.send(e);
    }
};
