"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "suggest",
    aliases: [],
    permissions: [],
    run: async (client, message, args) => {
        let sugg = message.content.split(" ").slice(1).join(" ");
        let data = await client.suggestions.addSuggestion({
            message: sugg,
            member: message.member
        });
        let embed = new discord_js_1.MessageEmbed()
            .setTitle("Sugerencia enviada a <#");
    }
};
