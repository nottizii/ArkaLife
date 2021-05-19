"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "seek",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.isDJ(message))
            return message.reply(client.errors.makeEmbed("No eres DJ!"));
        if (!client.distube.isPlaying(message))
            return message.reply(client.errors.makeEmbed("Nada reproduciendo!"));
    }
};
