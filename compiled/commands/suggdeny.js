"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "suggestdeny",
    aliases: ["deny", "denegar"],
    permissions: ["ADMINISTRATOR"],
    run: async (client, message, args) => {
        if (!args[1] || !args[0])
            return client.errors.makeEmbed("Formato invalido, uso: \n`a!denegar <ID de la sugerencia> <Razón>`");
        let reason = message.content.split(" ").slice(2).join(" ");
        let SiD = args[0];
        client.suggestions.reviewSuggestion(SiD, 0, reason, message.member.id);
        message.reply(new discord_js_1.MessageEmbed()
            .setDescription(`Sugerencia \`${SiD}\` **denegada**, razón: \n${reason}`));
    }
};
