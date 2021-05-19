import { Client } from "discord.js"
import * as Discord from "discord.js"
const chalk = require('chalk')
import * as fs from "fs"

module.exports = {
    name: "ready",
    run: async(client) => {
        client.user.setPresence({
            activities: [{
                name: "Aun en beta!"
            }],
            status: "idle"
        })

        let str = `Conectado en ${client.guilds.cache.size} servidor(es) con un total de ${client.users.cache.size} usuario(s)`
        console.log(str)
        //let channel = client.channels.cache.get('843666233945882635') as TextChannel
        //channel.send(str)
        client.commands = new Discord.Collection();
        const cmddir = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
        const musicdir = fs.readdirSync("./commands/music").filter(file => file.endsWith(".js"))

        for(const cmd of cmddir) {
            const cmdfile = require("../../commands/"+cmd)
            client.commands.set(cmdfile.name, cmdfile)
            console.log(chalk.green('[Command] ') + `${cmdfile.name} (${cmd}) loaded`)
        }
        for(const a of musicdir) {
            const musicfile = require("../../commands/music/"+a)
            client.commands.set(musicfile.name, musicfile)
            console.log(chalk.green('[Music] ') + `${musicfile.name} (${a}) loaded`)
        }
    }
}