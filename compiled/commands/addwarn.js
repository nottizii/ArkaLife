"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "warnadd",
    aliases: ['warn', 'addwarn'],
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (!args[0])
            return message.reply(client.errors.makeEmbed('Debes especificar un usuario!'));
        if (!message.mentions.members.first() && !message.guild.members.cache.get(args[0]))
            return message.reply(client.errors.makeEmbed("Usuario invalido!"));
        let warned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let { ID } = await client.warns.addWarn(message.member, warned, message, message.content.split(' ').slice(2)?.join(' '));
        message.reply(new discord_js_1.MessageEmbed()
            .setTitle("Warn Añadida!")
            .setDescription(`Usuario: \`${warned.displayName}\` \nWarn ID: ${ID}`)
            .setThumbnail(warned.user.displayAvatarURL()));
    }
};
