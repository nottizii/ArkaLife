const { MessageEmbed, Message } = require("discord.js");
module.exports = {
    name: "reply",
    aliases: ["say"],
    run: (message, args, client) => {
        const e = new MessageEmbed()
            .setTitle("Reply!")
            .setColor("#FFFFF0")
            .setDescription(args.join(" "));
        message.reply(e);
    }
};
