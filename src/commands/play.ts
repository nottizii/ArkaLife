import { Message } from 'discord.js'

module.exports = {
    name: "play",
    aliases: [],
    run: (client, message: Message, args) => {
        message.member.voice.channel.join()
    }
}