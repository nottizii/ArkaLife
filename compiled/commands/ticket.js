/* eslint-disable no-useless-escape */
const Discord = require('discord.js');
let cnf = require('../storage/settings.json');
module.exports = {
    name: "ticket",
    alias: ["t"],
    run: async (client, message, args) => {
        if (!message.content.startsWith(cnf.prefix))
            return;
        /****************
         * List function
         ****************/
        let list = async () => {
            if (!message.member.permissions.has("KICK_MEMBERS"))
                return;
            message.channel.startTyping();
            let connection = await client.functions.get("dbconnection").run();
            if (!connection) {
                message.channel.stopTyping();
                return message.channel.send("Internal Error.");
            }
            let qry = `SELECT * FROM bot_tickets WHERE type = 'ticket' && open = 1`;
            connection.query(qry, (err, rows, fields) => {
                connection.end();
                if (err) {
                    console.log(err);
                    return message.channel.send("Internal Error.");
                }
                else {
                    let embed = new Discord.MessageEmbed()
                        .setColor(cnf.color)
                        .setAuthor(message.guild.name, message.guild.iconURL());
                    if (!rows.length) {
                        message.channel.stopTyping();
                        return message.channel.send(embed.setDescription("No hay tickets abiertos"));
                    }
                    else {
                        let listString = "";
                        embed.setTitle(`**Tickets[${rows.length}]**`);
                        for (let ticket of rows) {
                            listString += `<@${ticket.user_id}> > <#${ticket.channel_id}>\n`;
                        }
                        embed.setDescription(listString);
                        message.channel.stopTyping();
                        return message.channel.send(embed);
                    }
                }
            });
        };
        /****************
         * List function
         ****************/
        let add = () => {
            if (!message.member.permissions.has("BAN_MEMBERS"))
                return;
            message.channel.startTyping();
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            }
            if (!args[0]) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("Debes mencionar un usuario o proporcionar una ID"));
            }
            else {
                let member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.id === args[1]);
                if (!member) {
                    message.channel.stopTyping();
                    return message.channel.send(client.errors.makeEmbed("Debes mencionar un usuario o proporcionar una ID"));
                }
                message.channel.updateOverwrite(member.user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true
                }).then(ch => ch.send(`**${member.user.tag}** ha sido añadido a <#${message.channel.id}> por <@${message.member.id}>`));
                return message.channel.stopTyping();
            }
        };
        let remove = () => {
            if (!message.member.permissions.has("BAN_MEMBERS"))
                return;
            message.channel.startTyping();
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            }
            if (!args[0]) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("Debes mencionar un usuario o proporcionar una ID"));
            }
            else {
                let member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.id === args[1]);
                if (!member) {
                    message.channel.stopTyping();
                    return message.channel.send(client.errors.makeEmbed("Debes mencionar un usuario o proporcionar una ID"));
                }
                message.channel.updateOverwrite(member.user, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false
                }).then(ch => ch.send(`${member.user.tag}** ha sido removido de <#${message.channel.id}>`));
                return message.channel.stopTyping();
            }
        };
        let close = async () => {
            if (!message.member.permissions.has("KICK_MEMBERS"))
                return;
            message.channel.startTyping();
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            }
            if (!ticket.open) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("No puedes cerrar un ticket dos veces!"));
            }
            else {
                let connection = await client.functions.get("dbconnection").run();
                if (!connection) {
                    message.channel.stopTyping();
                    return message.channel.send("Internal Error.");
                }
                let member = message.guild.members.cache.get(ticket.user);
                let qry = `UPDATE bot_tickets SET open = 0 WHERE user_id = '${ticket.user}' AND channel_id = '${message.channel.id}'`;
                connection.query(qry, (err, rows, fields) => {
                    connection.end();
                    if (err) {
                        console.log(err);
                        message.channel.stopTyping();
                        return message.channel.send(`Internal Error.`);
                    }
                    else {
                        message.channel.updateOverwrite(member, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false
                        }).then(ch => {
                            ticket.open = 0;
                            client.tickets.set(ticket.user, ticket);
                            message.channel.stopTyping();
                            message.channel.setParent('788910683575549952', { lockPermissions: false });
                            return message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription(":lock: Ticket Closed."));
                        });
                    }
                });
            }
        };
        let open = async () => {
            if (!message.member.permissions.has("KICK_MEMBERS"))
                return;
            message.channel.startTyping();
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            }
            if (ticket.open) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("Este ticket ya esta abierto!"));
            }
            else {
                let connection = await client.functions.get("dbconnection").run();
                if (!connection) {
                    message.channel.stopTyping();
                    return message.channel.send("Internal Error.");
                }
                let member = message.guild.members.cache.get(ticket.user);
                let qry = `UPDATE bot_tickets SET open = 1 WHERE user_id = '${member.user.id}' AND category = '${ticket.category}'`;
                connection.query(qry, (err, rows, fields) => {
                    connection.end();
                    if (err) {
                        console.log(err);
                        message.channel.stopTyping();
                        return message.channel.send(`Internal Error`);
                    }
                    else {
                        message.channel.updateOverwrite(member, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true
                        }).then(ch => {
                            ticket.open = 1;
                            client.tickets.set(ticket.user, ticket);
                            message.channel.stopTyping();
                            message.channel.setParent('786382219781472276', { lockPermissions: false });
                            return message.channel.send(new Discord.MessageEmbed().setColor("#FFFF55").setDescription(":unlock: Ticket opened"));
                        });
                    }
                });
            }
        };
        let deleteTicket = async () => {
            if (!message.member.permissions.has("KICK_MEMBERS"))
                return;
            message.channel.startTyping();
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            } //#aa0000
            let connection = await client.functions.get("dbconnection").run();
            if (!connection) {
                message.channel.stopTyping();
                return message.channel.send("Internal Error.");
            }
            let deleting = new Discord.MessageEmbed()
                .setColor("#aa0000")
                .setDescription(":bomb: El ticket será eliminado.");
            message.channel.stopTyping();
            message.channel.send(deleting);
            let qry = `DELETE FROM bot_tickets WHERE category = '${ticket.category}' AND user_id = '${ticket.user}'`;
            connection.query(qry, (err, rows, fields) => {
                if (err) {
                    connection.end();
                    console.log(err);
                    return message.channel.send(`Internal Error.`);
                }
                else {
                    setTimeout(() => {
                        message.channel.delete().then(ch => {
                            if (client.logsCh)
                                client.logsCh.send(deleting.setDescription(`El ticket **#${message.channel.name}** de <@${ticket.user}> fue borrado.`).setColor(cnf.color));
                            client.tickets.delete(ticket.user);
                            connection.end();
                        });
                    }, 4000);
                }
            });
        };
        let save = () => {
            if (!message.member.permissions.has("KICK_MEMBERS"))
                return;
            message.channel.startTyping();
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                message.channel.stopTyping();
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            }
            return client.commands.get("saveticket").run(client, message, args);
        };
        let move = async () => {
            if (!message.member.permissions.has("KICK_MEMBERS"))
                return;
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            }
            let connection = await client.functions.get("dbconnection").run();
            let qry = `SELECT tid FROM bot_tickets WHERE channel_id = '${message.channel.id}'`;
            connection.query(qry, (err, rows, fields) => {
                connection.end();
                if (err) {
                    console.log(err);
                    return message.channel.send("Internal Error.");
                }
                let movedto = message.content.split(" ").slice(2).join(" ");
                let embedmoved = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`<@${message.author.id}> Ha renombrado este ticket a \`movedto\``);
                message.channel.edit({
                    name: `${movedto}-${rows[0].tid}`
                });
                message.channel.send(embedmoved);
                message.delete();
            });
        };
        let vc = () => {
            if (!message.member.permissions.has("MANAGE_CHANNELS"))
                return;
            let ticket = client.tickets.find(t => t.channel === message.channel.id);
            if (!ticket) {
                return message.channel.send(client.errors.makeEmbed("El comando solo puede ser usado en tickets!"));
            }
            message.channel.clone({
                type: 'voice'
            });
        };
        let formatos = new Discord.MessageEmbed()
            .setColor(cnf.color)
            .addField("Uso incorrecto!.");
        if (!args[0]) {
            message.channel.stopTyping();
            return message.channel.send(formatos);
        }
        switch (args[0].toLowerCase()) {
            case "list":
                list();
                break;
            case "add":
                add();
                break;
            case "remove":
                remove();
                break;
            case "close":
                close();
                break;
            case "open":
                open();
                break;
            case "delete":
                deleteTicket();
                break;
            case "save":
                save();
                break;
            case "move":
                move();
                break;
            case "rename":
                move();
                break;
            case "vc":
                vc();
                break;
            case "voicechat":
                vc();
                break;
            default:
                message.channel.stopTyping();
                return message.channel.send(formatos);
        }
    }
};
