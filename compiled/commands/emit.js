"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "emit",
    aliases: [],
    run: (client, message, args) => {
        if (message.member.id !== '573991320897716224')
            return;
        client.emit("guildMemberAdd", message.member);
    }
};
