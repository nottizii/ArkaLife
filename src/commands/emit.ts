import { Client, Message } from "discord.js"

module.exports = {
    name: "emit",
    aliases: [],
    run: (client: Client, message: Message, args) => {
        return eval(args.join(' '))
    }
}