"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "prune",
    aliases: [],
    permissions: ['KICK_MEMBERS'],
    run: async (client, message, args) => {
        const number = await message.guild.members.prune({
            dry: true,
            days: 30
        });
        const rusure = new MessageEmbed()
            .setTitle("Confirmación")
            .setDescription(`Esto eliminará ${number} miembro(s), estas seguro de que deseas continuar? \nReacciona debajo para confirmar`);
        const m = await message.channel.send(rusure);
        m.react('❌');
        m.react('✅');
        m.awaitReactions((reaction, user) => (reaction.emoji.name === '❌' || reaction.emoji.name === '✅') && user.id === message.member.id, { time: 15000, errors: ['time'], max: 1 }).then(async (collected) => {
            if (collected?.first().emoji.name === '❌')
                return message.channel.send(new MessageEmbed().setDescription('❌ Comando cancelado'));
            if (collected?.first().emoji.name === '✅') {
                const suc = await message.channel.send(new MessageEmbed().setDescription('En progreso...'));
                let count = await message.guild.members.prune({
                    days: 30,
                    count: true,
                    reason: message.member.id + " | " + message.member.displayName
                });
                setTimeout(() => {
                    suc.edit(new MessageEmbed().setDescription(`✅ ${count} miembro(s) han sido eliminados`));
                }, 5000);
                m.delete();
            }
        }).catch(e => {
            return m.edit(new MessageEmbed().setDescription('❌ Comando cancelado'));
        });
    }
};
