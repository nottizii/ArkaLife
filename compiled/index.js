/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global process */
//// variables ////
const Discord = require('discord.js');
require('dotenv').config();
const settings = require('./storage/settings.json');
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
client.events = new Discord.Collection();
const evendir = fs.readdirSync(__dirname + "/util/handler").filter((file) => file.endsWith(".js"));
for (const ev of evendir) {
    const event = require("./util/handler/" + ev);
    client.events.set(event.name, event);
    console.log(chalk.green('[Event] ') + `${event.name} (${ev}) loaded`);
}
//// variables ////
client.once('ready', () => {
    client.events.get("ready").run(client);
    client.commands = new Discord.Collection();
    const cmddir = fs.readdirSync("./commands");
    for (const cmd of cmddir) {
        const cmdfile = require("./commands/" + cmd);
        client.commands.set(cmdfile.name, cmdfile);
        console.log(chalk.green('[Command] ') + `${cmdfile.name} (${cmd}) loaded`);
    }
});
client.on("message", async (message) => {
    client.events.get("message").run(client, message);
});
client.login(process.env['TOKEN']);
