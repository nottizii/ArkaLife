import { MessageEmbed } from "discord.js";
import { Message, Client } from "discord.js"

module.exports = {
    name: "suggest",
    aliases: [],
    permissions: [],
    run: async(client: Client, message: Message, args) => {
        if(!args[0]) return message.reply(client.errors.makeEmbed("Especifica una sugerencia!"))
        let sugg = message.content.split(" ").slice(1).join(" ");
        let data = await client.suggestions.addSuggestion({
            message: sugg,
            member: message.member
        })
        let embed = new MessageEmbed()
        .setDescription("Sugerencia enviada a <#"+client.settings.suggch+">")
        .setColor("GREEN")
        message.reply(embed)
    }
}