"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global process */
/* global __dirname */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//// variables ////
const distube_1 = __importDefault(require("distube"));
const Discord = require('discord.js');
require('dotenv').config();
const settings = require('./storage/settings.json');
const fs = require('fs');
const chalk = require('chalk');
const { GiveawaysManager } = require('discord-giveaways');
//////////////////// Client ////////////////////
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
client.distube = new distube_1.default(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnStop: true
});
//////////////////// Client ////////////////////
//////////////////// Event loader ////////////////////
client.events = new Discord.Collection();
const evendir = fs.readdirSync(__dirname + "/util/handler").filter((file) => file.endsWith(".js"));
for (const ev of evendir) {
    const event = require("./util/handler/" + ev);
    client.events.set(event.name, event);
    console.log(chalk.green('[Event] ') + `${event.name} (${ev}) loaded`);
}
//////////////////// Event loader ////////////////////
//////////////////// Giveaways handling ////////////////////
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./storage/giveaways.json",
    updateCountdownEvery: 30000,
    default: {
        botsCanWin: false,
        embedColor: "#FFFFFF",
        reaction: "🎉"
    }
});
//////////////////// Giveaways handling ////////////////////
//// variables ////
//// Event Handler ////
client.once('ready', () => {
    client.events.get("ready").run(client);
});
client.on("message", async (message) => {
    client.events.get("message").run(client, message);
});
client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entró al sorteo #${giveaway.messageID} (${reaction.emoji.name})`);
});
client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} salió del sorteo #${giveaway.messageID} (${reaction.emoji.name})`);
});
//// Event Handler ////
//// Login :) ////
client.login(process.env['TOKEN']);
