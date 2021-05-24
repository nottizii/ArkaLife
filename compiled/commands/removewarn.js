"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "delwarn",
    aliases: ['unwarn', 'removewarn'],
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        let wid = args[0];
        try {
            let w = await client.warns.deleteWarn(wid);
            message.reply(new discord_js_1.MessageEmbed()
                .setTitle("Advertencia removida")
                .setDescription(`La advertencia ${w} ha sido removida`));
        }
        catch (e) {
            console.error(e);
            return message.reply(client.errors.makeEmbed('ID invalido!'));
        }
    }
};
