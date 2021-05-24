import { Client, Message, MessageEmbed } from "discord.js"


module.exports = {
    name: "delwarn",
    aliases: ['unwarn', 'removewarn'],
    permissions: ['BAN_MEMBERS'],
    run: async(client: Client, message: Message, args) => {
        let wid = args[0]
        try {
            let w = await client.warns.deleteWarn(wid)
            message.reply(new MessageEmbed()
            .setTitle("Advertencia removida")
            .setDescription(`La advertencia ${w} ha sido removida`)
            )
        } catch (e) {
            console.error(e)
            return message.reply(client.errors.makeEmbed('ID invalido!'))
        }
    }
}