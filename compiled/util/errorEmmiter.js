"use strict";
const discord_js_1 = require("discord.js");
class ArkaLifeError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name ?? 'ArkaLifeError';
    }
    makeEmbed(error) {
        let embed = new discord_js_1.MessageEmbed()
            .setColor("RED")
            .setDescription(`❌ | Error: ${error}`);
        return embed;
    }
}
module.exports = ArkaLifeError;
