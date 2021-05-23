"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "status",
    aliases: [],
    run: async (client, message, args) => {
        let playornot;
        let loopstatus;
        const queue = client.distube.getQueue(message);
        const ip = client.distube.isPlaying(message);
        switch (queue.repeatMode) {
            case 0:
                loopstatus = 'Sin bucle';
                break;
            case 1:
                loopstatus = 'Cancion actual';
                break;
            case 2:
                loopstatus = 'Cola actual';
                break;
        }
        switch (ip) {
            case true:
                playornot = 'En reproducción';
                break;
            case false:
                playornot = 'Pausada';
                break;
        }
        message.reply(new discord_js_1.MessageEmbed()
            .setColor('PURPLE')
            .setTitle('Estado de la cola')
            .setDescription('Un poco de info sobre la reproducción de musica actuual!')
            .addField('Estado:', playornot)
            .addField('Estado de bucle:', loopstatus));
    }
};
