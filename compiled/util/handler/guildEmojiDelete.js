"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "emojiDelete",
    run: async (emoji) => {
        let author = await emoji.fetchAuthor();
        let client = emoji.client;
        let embed = new discord_js_1.MessageEmbed()
            .setTitle("Emoji Creado")
            .setDescription(d.toUTCString())
            .addField("Información:", `Nombre: ${emoji.name} \nID: ${emoji.id}\nAnimado?:${emoji.animated ? 'Si' : 'No'} \nIdentificador: \`${emoji.identifier}\``)
            .setImage(emoji.url);
        client.logs?.send(embed);
    }
};
