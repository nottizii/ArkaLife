/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global process */
/* global __dirname */

//// variables ////
import DisTube from "distube"
import Discord from 'discord.js'
require('dotenv').config()
const settings = require('./storage/settings.json')
const fs = require('fs')
const chalk = require('chalk')
import ArkaLifeError from "./util/errorEmmiter"
import { Collection, Message, MessageEmbed, Structures } from "discord.js"
import SuggestionManager from "./util/suggestionManager"
import { ConnectionConfig } from "mysql"
import { GiveawaysManager } from "discord-giveaways"
import { disconnect } from "process"

Structures.extend("GuildMember", GuildMember => {
    class ArkaMember extends GuildMember {
        constructor(client, data, guild) {
            super(client, data, guild)
        }
        isDJ(message: Message):boolean {
            return (this.roles.cache.find(r => r.name === 'DJ')) ? true : message.member.permissions.has("MANAGE_CHANNELS", true)
        }
    }
    return ArkaMember;
})

//////////////////// Client ////////////////////
const client = new Discord.Client({
    intents: Discord.Intents.ALL,
    partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"]
})

client.distube = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnStop: true
})

client.database = {
    host: "51.222.29.111",
    user: "u272_VjI7IPlU9A",
    database: "s272_data",
    password: "m2f51=t.2xLWm2c!LgRhgpwp"
}

client.errors = new ArkaLifeError('MusicError', '❌')
client.suggestions = new SuggestionManager(client.database)
client.settings = settings
//////////////////// Client ////////////////////

//////////////////// Event loader ////////////////////
client.events = new Discord.Collection();


const evendir = fs.readdirSync(__dirname + "/util/handler").filter((file) => file.endsWith(".js"));

for(const ev of evendir) {
    const event = require("./util/handler/"+ev)
    client.events.set(event.name, event)
    console.log(chalk.green('[Event] ') + `${event.name} (${ev}) loaded`)
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
    client.events.get("ready").run(client)    
})

client.on("message", async(message) => {
    client.events.get("message").run(client, message)
})

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entró al sorteo #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} salió del sorteo #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.distube.on("playSong", function(msg, queue, song) {
    queue.initMessage.channel.send(
        new MessageEmbed()
        .setDescription("Ahora reproduciendo: \n" + `[${song.name}](${song.url}) || \`${song.formattedDuration}\``)
        .setColor("GREEN")
    )
})

client.distube.on("empty", message => {
    message.channel.send(
        new MessageEmbed()
        .setDescription("Chat de voz vacio, saliendo...")
        .setColor("YELLOW")
    )
})

//// Event Handler ////

//// Login :) ////
client.login(process.env['TOKEN'])
//// Login :) ////

declare module 'discord.js' {
    interface Client {
        distube: DisTube,
        errors: ArkaLifeError,
        suggestions: SuggestionManager,
        database: ConnectionConfig,
        giveawaysManager: GiveawaysManager,
        settings: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events: any
    }

    interface GuildMember {
        isDJ(message): boolean
    }
}