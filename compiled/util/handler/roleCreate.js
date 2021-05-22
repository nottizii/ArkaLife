"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "roleCreate",
    run: async (role) => {
        let client = role.client;
        const e = new discord_js_1.MessageEmbed()
            .setTitle("Rol creado")
            .setDescription(d.toUTCString())
            .addFields([
            { name: 'Nombre', value: role.name, inline: true },
            { name: 'Color', value: role.hexColor, inline: true },
            { name: 'Mostrar por separado?', value: role.hoist, inline: true },
            { name: 'Posición', value: role.position, inline: true },
            { name: 'Rol', value: role.toString(), inline: true }
        ]);
        client.logs.send(e);
    }
};
