"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "roleCreate",
    run: async (role, newR) => {
        let client = role.client;
        let arr = [];
        if (role.name !== newR.name)
            arr.push({ name: 'Nombre', value: role.name + " => " + newR.name, inline: true });
        if (role.hexColor !== newR.hexColor)
            arr.push({ name: 'Color', value: role.hexColor + " => " + newR.hexColor, inline: true });
        if (role.hoist !== newR.hoist)
            arr.push({ name: 'Se muestra por separado?', value: role.hoist + " => " + newR.hoist, inline: true });
        if (role.rawPosition !== newR.rawPosition)
            arr.push({ name: 'Posicion', value: role.rawPosition + " => " + newR.rawPosition, inline: true });
        arr.push({ name: "Rol", value: newR.toString(), inline: true });
        const e = new discord_js_1.MessageEmbed()
            .setTitle("Rol edotado")
            .setDescription(d.toUTCString())
            .addFields(arr);
        client.logs?.send(e);
    }
};
