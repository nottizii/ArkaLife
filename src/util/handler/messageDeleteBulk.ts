import { Collection, Message, MessageEmbed, MessageAttachment, Snowflake } from "discord.js";
import fs from 'fs'
import path from "path";
let d = new Date()

module.exports = {
    name: "messageDelete",
    run: async (messages: Collection<Snowflake, Message>) => {
        let client = messages.first().client
        let file = fs.createWriteStream(path.join(__dirname, "../../storage") + 'messageDeleteBulk.txt')
        messages.forEach(m => {
            file.write(`[${m.member.displayName} | ${m.member.id}] >> ${m.content}\n`)
        })
        file.end()
        const log = new MessageAttachment(path.join(__dirname, "../../storage") + 'messageDeleteBulk.txt')
        client.logs?.send(log)
    }
}