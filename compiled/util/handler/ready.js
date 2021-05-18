"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const chalk = require("chalk");
module.exports = {
    name: "ready",
    run: async (client) => {
        client.user.setPresence({
            activities: [{
                    name: "Aun en beta!"
                }],
            status: "idle"
        });
        let str = `Conectado en ${client.guilds.cache.size} servidor(es) con un total de ${client.users.cache.size} usuario(s)`;
        console.log(str);
        //let channel = client.channels.cache.get('843666233945882635') as TextChannel
        //channel.send(str)
        client.commands = new Discord.Collection();
        const cmddir = fs.readdirSync("./commands");
        for (const cmd of cmddir) {
            const cmdfile = require("../../commands/" + cmd);
            client.commands.set(cmdfile.name, cmdfile);
            console.log(chalk.green('[Command] ') + `${cmdfile.name} (${cmd}) loaded`);
        }
    }
};
