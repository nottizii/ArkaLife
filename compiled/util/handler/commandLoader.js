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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const discord_js_1 = require("discord.js");
const Discord = __importStar(require("discord.js"));
const chalk = require('chalk');
const fs = __importStar(require("fs"));
function load(client) {
    client = { ...discord_js_1.Client };
    client.commands = new Discord.Collection();
    const cmddir = fs.readdirSync("./commands");
    const musicdir = fs.readdirSync("./commands/music");
    for (const cmd of cmddir) {
        const cmdfile = require("../../commands/" + cmd);
        client.commands.set(cmdfile.name, cmdfile);
        console.log(chalk.green('[Command] ') + `${cmdfile.name} (${cmd}) loaded`);
    }
    for (const cmd of musicdir) {
        const cmdfile = require("../../commands/" + cmd);
        client.commands.set(cmdfile.name, cmdfile);
        console.log(chalk.bgGreen('[Music] ') + `${cmdfile.name} (${cmd}) loaded`);
    }
    return true;
}
module.exports = { load };
module.exports = load;
