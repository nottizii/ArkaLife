import { MessageEmbed } from "discord.js";
import { Message, Client } from "discord.js"

module.exports = {
    name: "suggest",
    aliases: [],
    permissions: [],
    run: async(client: Client, message: Message, args) => {
        let sugg = message.content.split(" ").slice(1).join(" ");
        let data = await client.suggestions.addSuggestion({
            message: sugg,
            member: message.member
        })
        let embed = new MessageEmbed()
        .setTitle("Sugerencia enviada a <#")
    }
}