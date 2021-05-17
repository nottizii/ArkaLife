const { prefix } = require('../../storage/settings.json')

module.exports = {
    name: "message",
    run: async(client, message) => {

        if(message.author.bot) return;
        const matchedPrefix = prefix
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command) || client.commands.find(c => c.aliases?.includes(cmd))
        if(cmd) {
            cmd.run(message, args, client)
        }
    }
}