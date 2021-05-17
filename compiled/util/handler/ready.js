module.exports = {
    name: "ready",
    run: async (client) => {
        client.user.setPresence({
            activities: [{
                    name: "Aun en beta!"
                }],
            status: "idle"
        });
        let str = `Conectado en ${client.guilds.cache.size} servidor(es) con un total de ${client.users.cache.size} usuario(s)`;
        let channel = client.channels.cache.get('843666233945882635');
        channel.send(str);
    }
};
export {};
