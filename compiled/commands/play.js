"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "play",
    aliases: [],
    run: (client, message, args) => {
        message.member.voice.channel.join();
    }
};
