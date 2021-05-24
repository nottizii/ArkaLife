import { Client, Message, MessageEmbed } from "discord.js"


module.exports = {
    name: "warnadd",
    aliases: ['warn', 'addwarn'],
    permissions: ['BAN_MEMBERS'],
    run: async(client: Client, message: Message, args) => {
        if(!args[0]) return message.reply(client.errors.makeEmbed('Debes especificar un usuario!'))
        if(!message.mentions.members.first() && !message.guild.members.cache.get(args[0])) return message.reply(client.errors.makeEmbed("Usuario invalido!"))
        let warned = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let { ID } = await client.warns.addWarn(message.member, warned, message, message.content.split(' ').slice(2)?.join(' '))
        message.reply(new MessageEmbed()
        .setTitle("Warn Añadida!")
        .setDescription(`Usuario: \`${warned.displayName}\` \nWarn ID: ${ID}`)
        .setThumbnail(warned.user.displayAvatarURL())
        )
    }
}