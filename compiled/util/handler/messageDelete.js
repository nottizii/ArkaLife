"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "messageDelete",
    run: async (message) => {
        let client = message.client;
        const e = new discord_js_1.MessageEmbed()
            .setTitle("Mensaje eliminado!")
            .setDescription(d.toUTCString())
            .addField("Contenido:", message.content ?? "Error: No pude recuperar el contenido");
        client.logs?.send(e);
    }
};
