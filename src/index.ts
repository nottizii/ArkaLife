/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global process */
/* global __dirname */

//// variables ////
import DisTube from "distube"
import Discord, { TextChannel, Collection } from 'discord.js'
require('dotenv').config()
const settings = require('./storage/settings.json')
const fs = require('fs')
const chalk = require('chalk')
import ArkaLifeError from "./util/errorEmmiter"
import { Message, MessageEmbed, Structures, GuildMember, Client } from "discord.js"
import SuggestionManager from "./util/suggestionManager"
import { ConnectionConfig } from "mysql"
import { GiveawaysManager } from "discord-giveaways"
import path from "path"
let d = new Date()

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
    partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
    debugMode: true
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
client.logs = client.channels.cache.get('845436480570261554') as TextChannel
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
    storage: path.join(__dirname, "./storage/giveaways.json"),
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
    client.events.get("message").run(client, message).bind()
})

client.on("rateLimit", rl => {
    if(client.options.debugMode === false) return
    console.log("[RATELIMIT] " + rl.route + " => " + rl.timeout)
})

client.on("warn", w => {
    if(client.options.debugMode === false) return
    console.warn("[WARN] " + w)
})

client.on("debug", d => {
    if(client.options.debugMode === false) return
    console.debug("[DEBUG] " + d)
})

client.on("guildMemberAdd", async member => {
    client.events.get("guildMemberAdd").run(member)
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

client.suggestions.on("suggestionAdd", async(sugg: SuggestionData) => {
    let ch = client.channels.cache.get(client.settings.suggch) as TextChannel
    const e = new MessageEmbed()
    .setTitle("Nueva Sugerencia!")
    .setDescription(`Usuario: ${client.users.cache.get(sugg.UserID)?.tag ?? 'Desconocido!'}\nFecha: ${d.toUTCString()}`)
    .addField("Sugerencia:", sugg.Text)
    .addField("Respuesta:", "Aun sin respuesta!")
    .setColor("YELLOW")
    .setFooter(`${ch.guild.name} ▪ ${sugg.ID}`)
    let m = await ch.send(e)
    m.react("<:champ_downvote:844690963028115507>")
    m.react("<:champ_upvote:844690963191431238>")

    client.suggestions.markAP(sugg.ID, m.id)
})

client.suggestions.on("suggestionDelete", async(sugg: SuggestionData) => {
    let ch = client.channels.cache.get(client.settings.suggch) as TextChannel
    let m = await ch.messages.fetch(sugg.MsgID)
    m.delete()
})

client.suggestions.on("suggestionReview", async(sugg: SuggestionData) => {
    let ch = client.channels.cache.get(client.settings.suggch) as TextChannel
    const e = new MessageEmbed()
    .setTitle("Nueva Sugerencia!")
    .setDescription(`Usuario: ${client.users.cache.get(sugg.UserID)?.tag ?? 'Desconocido!'}\nFecha: ${d.toUTCString()} $}`)
    .addField("Sugerencia:", sugg.Text)
    .setFooter(`${ch.guild.name} ▪ ${sugg.ID}`)
    .addField("Respuesta:", `De: <@${sugg.Reviewer}> \n${sugg.Review}`)
    let m = await ch.messages.fetch(sugg.MsgID)
    if(sugg.Status === 0) {
        e.setColor("RED")
    }
    if(sugg.Status === 1) {
        e.setColor("GREEN")
    }
    m.edit(e)

});

client.suggestions.on("markAP", () => {
    console.log("Nueva sugerencia publicada")
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settings: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events: Collection<Snowflake, ArkaCommand>,
        commands: Collection<Snowflake, ArkaCommand>,
        logs: TextChannel
    }

    interface GuildMember {
        isDJ(message): boolean
    }

    interface ClientOptions {
        debugMode: boolean
    }
}

interface SuggestionData {
    ID: string
    Status: number
    Text: string
    UserID: GuildMember["id"]
    Review: string
    Reviewer: string | GuildMember["id"]
    Score: number,
    MsgID: string
}

interface ArkaCommand {
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    run: (any)
    permissions?: []
    aliases: Array<string>
}