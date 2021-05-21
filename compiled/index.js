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
    if (Math.floor(member.user.createdTimestamp - Date.now() / 86400000) > 30)
        return member.kick("El usuario no tenía 30 dias en discord");
    /*let channel = client.channels.cache.get('844935680794689597') as TextChannel
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage('./storage/OIP.jpg');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#74037b';

    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.font = '60px sans-serif';
    // Select the style that will be used to fill the text in
    context.fillStyle = '#ffffff';
    // Actually fill the text with a solid color
    context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);
    context.beginPath();
    // Start the arc to form a circle
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    // Put the pen down
    context.closePath();
    // Clip off the region you drew on
    context.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    context.drawImage(avatar, 25, 25, 200, 200);
    
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome.png');
    channel.send(`Bienvenido al server ${member}"`, attachment)
    */
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
