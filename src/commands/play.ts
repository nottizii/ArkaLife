import { Message, Guild } from 'discord.js'
import * as Discord from 'discord.js'
const ytsr = require('ytsr')
const ytdl = require('ytdl-core');


module.exports = {
    name: "play",
    aliases: [],
    run: async (client, message: Message, args) => {
        //// funciones ////
        async function search(query:string):Promise<string> {
            const searchResults = await ytsr(query, { limit: 1 });
            const url = searchResults.items[0].url;
            return new Promise(function(resolve, reject){
                resolve(url)
            })
        }
        console.log(message.guild.queue)
        //// funciones ////
        /*
        let connection = await message.member.voice.channel.join()
        let url = await search(args.join(' '))
        connection.play(ytdl(url, { filter: 'audioonly' }));
        */
    }
}