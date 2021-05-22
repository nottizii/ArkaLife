"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "roleDelete",
    run: async (role) => {
        let client = role.client;
        const e = new discord_js_1.MessageEmbed()
            .setTitle("Rol eliminado")
            .setDescription(d.toUTCString())
            .addFields([
            { name: 'Nombre', value: role.name, inline: true },
            { name: 'Color', value: role.hexColor, inline: true },
            { name: 'Mostrar por separado?', value: role.hoist, inline: true },
            { name: 'Posición', value: role.position, inline: true },
            { name: 'ID', value: role.id, inline: true }
        ]);
        let logs = client.channels.cache.get('845436480570261554');
        logs?.send(e);
    }
};
