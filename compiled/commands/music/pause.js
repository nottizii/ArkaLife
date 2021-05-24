"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "pause",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.isDJ(message))
            return message.reply(client.errors.makeEmbed('No eres un DJ!'));
        if (!client.distube.isPlaying(message))
            return message.reply(client.errors.makeEmbed('Nada reproduciendose!'));
        client.distube.pause(message);
        message.reply(new discord_js_1.MessageEmbed().setColor("YELLOW").setDescription("Reproducción pausada!"));
    }
};
