module.exports = {
    name: "greroll",
    aliases: [],
    run: (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.permission.has('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Necesitas el permiso de GESTIONAR MENSAJES para resortear un sorteo.');
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
        return message.channel.send(':x: Debes mencionar una ID de mensaje válida.');
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.channel.send('No se ha podido encontrar un sorteo con la ID: `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.channel.send('¡Premio resorteado!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('El sorteo no ha finalizado');
        } else {
            console.error(e);
            message.channel.send('An error occured...');
        }
    });
	}
}