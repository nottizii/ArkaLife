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
const discord_js_1 = __importDefault(require("discord.js"));
require('dotenv').config();
const settings = require('./storage/settings.json');
const fs = require('fs');
const chalk = require('chalk');
const errorEmmiter_1 = __importDefault(require("./util/errorEmmiter"));
const discord_js_2 = require("discord.js");
const suggestionManager_1 = __importDefault(require("./util/suggestionManager"));
const discord_giveaways_1 = require("discord-giveaways");
const path_1 = __importDefault(require("path"));
let d = new Date();
discord_js_2.Structures.extend("GuildMember", GuildMember => {
    class ArkaMember extends GuildMember {
        constructor(client, data, guild) {
            super(client, data, guild);
        }
        isDJ(message) {
            return (this.roles.cache.find(r => r.name === 'DJ')) ? true : message.member.permissions.has("MANAGE_CHANNELS", true);
        }
    }
    return ArkaMember;
});
//////////////////// Client ////////////////////
const client = new discord_js_1.default.Client({
    intents: discord_js_1.default.Intents.ALL,
    partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
    debugMode: true
});
client.distube = new distube_1.default(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnStop: true
});
client.database = {
    host: "51.222.29.111",
    user: "u272_VjI7IPlU9A",
    database: "s272_data",
    password: "m2f51=t.2xLWm2c!LgRhgpwp"
};
client.errors = new errorEmmiter_1.default('MusicError', '❌');
client.suggestions = new suggestionManager_1.default(client.database);
client.settings = settings;
//////////////////// Client ////////////////////
//////////////////// Event loader ////////////////////
client.events = new discord_js_1.default.Collection();
const evendir = fs.readdirSync(__dirname + "/util/handler").filter((file) => file.endsWith(".js"));
for (const ev of evendir) {
    const event = require("./util/handler/" + ev);
    client.events.set(event.name, event);
    console.log(chalk.green('[Event] ') + `${event.name} (${ev}) loaded`);
}
//////////////////// Event loader ////////////////////
//////////////////// Giveaways handling ////////////////////
client.giveawaysManager = new discord_giveaways_1.GiveawaysManager(client, {
    storage: path_1.default.join(__dirname, "./storage/giveaways.json"),
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
client.on("rateLimit", rl => {
    if (client.options.debugMode === false)
        return;
    console.log("[RATELIMIT] " + rl.route + " => " + rl.timeout);
});
client.on("warn", w => {
    if (client.options.debugMode === false)
        return;
    console.warn("[WARN] " + w);
});
client.on("debug", d => {
    if (client.options.debugMode === false)
        return;
    console.debug("[DEBUG] " + d);
});
client.on("guildMemberAdd", async (member) => {
    client.events.get("guildMemberAdd").run(member);
});
client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entró al sorteo #${giveaway.messageID} (${reaction.emoji.name})`);
});
client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} salió del sorteo #${giveaway.messageID} (${reaction.emoji.name})`);
});
client.distube.on("playSong", function (msg, queue, song) {
    queue.initMessage.channel.send(new discord_js_2.MessageEmbed()
        .setDescription("Ahora reproduciendo: \n" + `[${song.name}](${song.url}) || \`${song.formattedDuration}\``)
        .setColor("GREEN"));
});
client.distube.on("empty", message => {
    message.channel.send(new discord_js_2.MessageEmbed()
        .setDescription("Chat de voz vacio, saliendo...")
        .setColor("YELLOW"));
});
client.suggestions.on("suggestionAdd", async (sugg) => {
    let ch = client.channels.cache.get(client.settings.suggch);
    const e = new discord_js_2.MessageEmbed()
        .setTitle("Nueva Sugerencia!")
        .setDescription(`Usuario: ${client.users.cache.get(sugg.UserID)?.tag ?? 'Desconocido!'}\nFecha: ${d.toUTCString()} $}`)
        .addField("Sugerencia:", sugg.Text)
        .addField("Respuesta:", "Aun sin respuesta!")
        .setColor("YELLOW")
        .setFooter(`${ch.guild.name} ▪ ${sugg.ID}`);
    let m = await ch.send(e);
    m.react("<:champ_downvote:844690963028115507>");
    m.react("<:champ_upvote:844690963191431238>");
    client.suggestions.markAP(sugg.ID, m.id);
});
client.suggestions.on("suggestionDelete", async (sugg) => {
    let ch = client.channels.cache.get(client.settings.suggch);
    let m = await ch.messages.fetch(sugg.MsgID);
    m.delete();
});
client.suggestions.on("suggestionReview", async (sugg) => {
    let ch = client.channels.cache.get(client.settings.suggch);
    const e = new discord_js_2.MessageEmbed()
        .setTitle("Nueva Sugerencia!")
        .setDescription(`Usuario: ${client.users.cache.get(sugg.UserID)?.tag ?? 'Desconocido!'}\nFecha: ${d.toUTCString()} $}`)
        .addField("Sugerencia:", sugg.Text)
        .setFooter(`${ch.guild.name} ▪ ${sugg.ID}`)
        .addField("Respuesta:", `De: <@${sugg.Reviewer}> \n${sugg.Review}`);
    let m = await ch.messages.fetch(sugg.MsgID);
    if (sugg.Status === 0) {
        e.setColor("RED");
    }
    if (sugg.Status === 1) {
        e.setColor("GREEN");
    }
    m.edit(e);
});
client.suggestions.on("markAP", () => {
    console.log("Nueva sugerencia publicada");
});
//// Event Handler ////
//// Login :) ////
client.login(process.env['TOKEN']);
