const ms = require('ms');
const config = require("../storage/settings.json")

module.exports = {
    name: "gstart",
    aliases: [],
    run: (client, message, args) => {
     // If the member doesn't have enough permissions
    if(!message.member.permissions.has('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Necesitas el permiso de GESTIONAR MENSAJES para realizar un sorteo.');
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(':x: Menciona un canal válido.');
    }

    // Giveaway duration
    let giveawayDuration = args[1];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: Menciona una duración válida.');
    }

    // Number of winners
    let giveawayNumberWinners = args[2];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(':x: Debes especificar una cantidad de ganadores válida.');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: Debes mencionar un premio válido.');
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: parseInt(giveawayNumberWinners),
        // Who hosts this giveaway
        hostedBy: config.hostedBy ? message.author : null,
        // Messages
        messages: {
            giveaway: (config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **SORTEO** 🎉🎉",
            giveawayEnded: (config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **SORTEO FINALIZADO** 🎉🎉",
            timeRemaining: "Tiempo restante: **{duration}**!",
            inviteToParticipate: "¡Reacciona con 🎉 para participar!",
            winMessage: "Felicidades {winners}, Has ganado **{prize}**!",
            embedFooter: "StartonMC",
            noWinner: "Sorteo cancelado.",
            hostedBy: "Hosteado por: {user}",
            winners: "Ganador(es)",
            endedAt: "Termina",
            units: {
                seconds: "segundos",
                minutes: "minutos",
                hours: "horas",
                days: "dias",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.channel.send(`Sorteo iniciado en ${giveawayChannel}!`);
	}
}