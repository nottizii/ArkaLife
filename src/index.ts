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
import { suggestionManager } from "./util/suggestionManager"
import { ConnectionConfig } from "mysql"
import { GiveawaysManager } from "discord-giveaways"
import path from "path"
import { ArkaClient } from './util/ArkaClient'
import { warningManager } from "./util/warnManager"
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
const client = new ArkaClient({
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
    password: "=@84q9S=Mw^yv0XQqJtKI@by"
}

client.errors = new ArkaLifeError('MusicError', '❌')
client.suggestions = new suggestionManager(client.database)
client.warns = new warningManager(client.database)

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
client.once('ready', async() => {
    client.events.get("ready").run(client)
})

client.on("message", async(message) => {
    client.events.get("message").run(client, message)
})

client.on("channelCreate", async(channel) => {
    client.events.get("channelCreate").run(channel)
})

client.on("channelDelete", async(channel) => {
    client.events.get("channelDelete").run(channel)
})

client.on("channelUpdate", async(channel, nch) => {
    client.events.get("channelUpdate").run(channel, nch)
})

client.on("emojiCreate", async(emoji) => {
    client.events.get("emojiCreate").run(emoji)
})

client.on("emojiDelete", async(emoji) => {
    client.events.get("emojiDelete").run(emoji)
})

client.on("emojiUpdate", async(emoji, ne) => {
    client.events.get("emojiUpdate").run(emoji, ne)
})

client.on("guildBanAdd", async(ban) => {
    client.events.get("guildBanAdd").run(ban)
})

client.on("guildBanRemove", async(ban) => {
    client.events.get("guildBanRemove").run(ban)
})

client.on("guildMemberAdd", async member => {
    client.events.get("guildMemberAdd").run(member)
})

client.on("guildMemberRemove", async member => {
    client.events.get("guildMemberRemove").run(member)
})

client.on("guildMemberUpdate", async(oldm, newm) => {
    client.events.get("guildMemberUpdate").run(oldm, newm)
})

client.on("guildUpdate", async(oldg, newg) => {
    client.events.get("guildUpdate").run(oldg, newg)
})

client.on("messageDelete", async(msg) => {
    client.events.get("guildMemberUpdate").run(msg, client)
})

client.on("messageDeleteBulk", async(messages) => {
    client.events.get("messageDeleteBulk").run(messages)
})

client.on("messageUpdate", async(oldm, newm) => {
    client.events.get("messageUpdate").run(oldm, newm)
})

client.on("roleCreate", async(role) => {
    client.events.get("roleCreate").run(role)
})

client.on("roleDelete", async(role) => {
    client.events.get("roleDelete").run(role)
})

client.on("roleUpdate", async(role, nrole) => {
    client.events.get("roleUpdate").run(role, nrole)
})

client.on("voiceStateUpdate", async(oldv, newv) => {
    client.events.get("voiceStateUpdate").run(oldv, newv)
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
client.login(process.env['TOKEN']).then(() => {
    client.defineLogs('845436480570261554')
} )
//// Login :) ////


declare module 'discord.js' {
    interface Client {
        distube: DisTube,
        errors: ArkaLifeError,
        suggestions: suggestionManager,
        database: ConnectionConfig,
        giveawaysManager: GiveawaysManager,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settings: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events: Collection<Snowflake, ArkaCommand>,
        commands: Collection<Snowflake, ArkaCommand>,
        logs: TextChannel
        warns: warningManager
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