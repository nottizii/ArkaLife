"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
let d = new Date();
module.exports = {
    name: "emojiUpdate",
    run: async (oldEmoji, newEmoji) => {
        let author = await oldEmoji.fetchAuthor();
        let client = oldEmoji.client;
        let embed = new discord_js_1.MessageEmbed()
            .setTitle("oldEmoji Actualizado")
            .setDescription(d.toUTCString())
            .addField("Información:", `Nombre: ${oldEmoji.name} => ${newEmoji.name}\nID: ${newEmoji.id}\nAnimado?:${newEmoji.animated ? 'Si' : 'No'} \nIdentificador: \`${newEmoji.identifier}\``)
            .setImage(newEmoji.url);
        let logs = client.channels.cache.get('845436480570261554');
        logs?.send(embed);
    }
};
