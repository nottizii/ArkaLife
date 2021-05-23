"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "suggestapprove",
    aliases: ["approve", "aprobar"],
    permissions: ["ADMINISTRATOR"],
    run: async (client, message, args) => {
        if (!args[1] || !args[0])
            return client.errors.makeEmbed("Formato invalido, uso: \n`a!aprobar <ID de la sugerencia> <Razón>`");
        let reason = message.content.split(" ").slice(2).join(" ");
        let SiD = args[0];
        client.suggestions.reviewSuggestion(SiD, 1, reason, message.member.id);
        message.reply(new discord_js_1.MessageEmbed()
            .setDescription(`Sugerencia \`${SiD}\` **aprobada**, razón: \n${reason}`));
    }
};
