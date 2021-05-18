"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { MessageEmbed } = require("discord.js");
const { prefix } = require('../../storage/settings.json');
module.exports = {
    name: "message",
    run: async (client, message) => {
        const erremb = new MessageEmbed()
            .setDescription('Whoops, parece que no tienes permiso para hacer esto!')
            .setColor('RED');
        if (message.author.bot)
            return;
        if (!message.guild || !message.member)
            return;
        const matchedPrefix = prefix;
        if (!message.content.startsWith(matchedPrefix))
            return;
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command) || client.commands.find(c => c.aliases?.includes(command));
        if (cmd) {
            if (!cmd.permissions)
                return cmd.run(client, message, args);
            if (message.member.permissions.has(cmd.permissions))
                return cmd.run(client, message, args);
            message.reply(erremb);
        }
    }
};
