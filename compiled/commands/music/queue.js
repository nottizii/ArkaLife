"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "queue",
    aliases: [],
    run: async (client, message, args) => {
        let queue = client.distube.getQueue(message);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("Cola de reproducción actual:")
            .setDescription(queue.songs.map((song, id) => `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n"))
            .setThumbnail(queue.songs[0].thumbnail);
        message.reply(embed);
    }
};
