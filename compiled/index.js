//// ts/eslint things////
//// ts/eslint things////
//// variables ////
const Discord = require('discord.js');
require('dotenv').config();
const settings = require('./storage/settings.json');
const fs = require('fs');
const chalk = require('chalk');
const { GiveawaysManager } = require('discord-giveaways');
Discord.Structures.extend("Guild", Guild => {
    class ExtGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.queue = new Discord.Collection();
        }
    }
    return ExtGuild;
});
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
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./storage/giveaways.json",
    updateCountdownEvery: 30000,
    default: {
        botsCanWin: false,
        embedColor: "#FFFFFF",
        reaction: "🎉"
    }
});
//// variables ////
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
client.login(process.env['TOKEN']);
