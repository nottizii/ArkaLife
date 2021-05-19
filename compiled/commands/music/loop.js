"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "loop",
    aliases: [],
    run: async (client, message, args) => {
        if (!message.member.isDJ(message))
            return message.reply(client.errors.makeEmbed('No eres DJ!'));
        if (!client.distube.isPlaying(message))
            return message.reply(client.errors.makeEmbed('Nada reproduciendo!'));
        if (!args[0] || Number(args[0]) > 2)
            return message.reply(client.errors.makeEmbed('Debes especificar un modo de bucle! \n\nModo 0: off \nModo 1: Cancion actual \nModo 2: Cola actual'));
        switch (parseInt(args[0])) {
            case 0:
                client.distube.setRepeatMode(message, 0);
                return message.reply('Modo de bucle: off');
                break;
            case 1:
                client.distube.setRepeatMode(message, 1);
                return message.reply('Modo de bucle: Canción actual');
                break;
            case 2:
                client.distube.setRepeatMode(message, 2);
                return message.reply('Modo de bucle: Cola actual');
                break;
        }
    }
};
