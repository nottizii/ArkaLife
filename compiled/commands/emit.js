"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "emit",
    aliases: [],
    run: (client, message, args) => {
        return eval(args.join(' '));
    }
};
