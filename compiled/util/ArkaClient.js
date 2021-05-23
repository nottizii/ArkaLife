"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArkaClient = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const discord_js_1 = require("discord.js");
class ArkaClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
    }
    defineLogs(chid) {
        console.log("Logs defined");
        return this.logs = this.channels.cache.get(chid);
    }
}
exports.ArkaClient = ArkaClient;
module.exports = { ArkaClient };
