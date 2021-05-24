"use strict";
/* global __dirname */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const chalk = require('chalk');
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
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
        const cmddir = fs.readdirSync(path_1.default.join(__dirname, "../../commands").split('\\').join('/')).filter(file => file.endsWith(".js"));
        const musicdir = fs.readdirSync(path_1.default.join(__dirname, "../../commands/music").split('\\').join('/')).filter(file => file.endsWith(".js"));
        for (const cmd of cmddir) {
            const cmdfile = require("../../commands/" + cmd);
            client.commands.set(cmdfile.name, cmdfile);
            console.log(chalk.green('[Command] ') + `${cmdfile.name} (${cmd}) loaded`);
        }
        for (const a of musicdir) {
            const musicfile = require("../../commands/music/" + a);
            client.commands.set(musicfile.name, musicfile);
            console.log(chalk.green('[Music] ') + `${musicfile.name} (${a}) loaded`);
        }
    }
};
