import * as Discord from 'discord.js'
import * as fs from 'fs'
import chalk = require('chalk')

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
    }
}