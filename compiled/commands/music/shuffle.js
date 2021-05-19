"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "shuffle",
    aliases: [],
    run: async (client, message, args) => {
        const q = await client.distube.shuffle(message);
        let songs = q.songs.join('\n');
        const e = new discord_js_1.MessageEmbed()
            .setTitle("Lista Mezclada!")
            .setDescription(songs.slice(1000));
        message.reply(e);
    }
};
