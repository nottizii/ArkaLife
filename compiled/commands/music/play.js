"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "play",
    aliases: [],
    run: async (client, message, args) => {
        if (!args[0])
            return message.reply(client.errors.makeEmbed('Especifica una canción!'));
        let searchf = await client.distube.search(args.join(' '));
        let search = searchf[0];
        client.distube.play(message, search);
        message.reply(new discord_js_1.MessageEmbed().setColor("BLUE").setDescription(`Añadida a la cola: \n[${search.title}](${search.url})`));
    }
};
