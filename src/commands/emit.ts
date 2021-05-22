import { Client, Message } from "discord.js"

module.exports = {
    name: "emit",
    aliases: [],
    run: (client: Client, message: Message, args) => {
        if(message.member.id !== '573991320897716224') return;
        client.emit("guildMemberAdd", message.member)
    }
}