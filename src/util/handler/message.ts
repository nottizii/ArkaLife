import { Message } from "discord.js";
import settings from '../../storage/settings.json';


module.exports = {
    name: "ready",
    run: async(message: Message, client) => {
        if(message.author.bot) return;
        const prefix = settings.prefix
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;

        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command) || client.commands.find(c => c.aliases?.includes(cmd))
        if(cmd) {
            cmd.run(message, args, client)
        }
    }
}