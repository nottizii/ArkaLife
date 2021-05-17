/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global process */
const Discord = require('discord.js');
require('dotenv').config();
const settings = require('../settings.json');
const fs = require('fs');
const chalk = require('chalk');
const { giveawayManager } = require('discord-giveaways');
const client = new Discord.Client({
    intents: Discord.Intents.ALL,
    fetchAllMembers: true,
    partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
    presence: {
        status: "idle",
        afk: true,
        activity: {
            name: "Aun en beta!",
            type: "watching"
        }
    }
});
client.once('ready', () => {
    client.events.get("ready").run(client);
});
client.on("message", async (message) => {
    if (message.author.bot)
        return;
    const prefix = settings.prefix;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content))
        return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
});
//// funciones ////
function escapeRegex(str) {
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//// funciones ////
//// variables ////
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.functions = new Discord.Collection();
const evendir = fs.readdirSync("./util/handler").filter((file) => file.endsWith(".js"));
const funcdir = fs.readdirSync("./util/functions").filter((file) => file.endsWith(".js"));
const cmddir = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const ev of evendir) {
    const event = require("./util/handler" + ev);
    client.events.set(event.name, event);
    console.log(chalk.green('[Event] ') + `${event.name} (${ev}) loaded`);
}
for (const cmd of cmddir) {
    const cmdfile = require("./commands" + cmd);
    client.events.set(cmdfile.name, cmdfile);
    console.log(chalk.green('[Command] ') + `${cmdfile.name} (${cmd}) loaded`);
}
for (const func of funcdir) {
    const funct = require("./util/functions" + func);
    client.events.set(funct.name, funct);
    console.log(chalk.green('[Function] ') + `${funct.name} (${func}) loaded`);
}
//// variables ////
client.login(process.env.TOKEN);
