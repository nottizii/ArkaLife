"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "suggest",
    aliases: [],
    permissions: [],
    run: async (client, message, args) => {
        if (!args[0])
            return message.reply(client.errors.makeEmbed("Especifica una sugerencia!"));
        let sugg = message.content.split(" ").slice(1).join(" ");
        let data = await client.suggestions.addSuggestion({
            message: sugg,
            member: message.member
        });
        let embed = new discord_js_1.MessageEmbed()
            .setDescription("Sugerencia enviada a <#" + client.settings.suggch + ">")
            .setColor("GREEN");
        message.reply(embed);
    }
};
