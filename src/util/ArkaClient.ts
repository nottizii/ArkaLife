/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Client, TextChannel } from "discord.js";

export class ArkaClient extends Client {
    constructor(options) {
        super(options)
    }

    public defineLogs(chid) {
        console.log("Logs defined")
        return this.logs = this.channels.cache.get(chid) as TextChannel
    }
}

module.exports = { ArkaClient }