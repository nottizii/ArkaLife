const discord = require('discord.js');
const { transcriptch } = require('../storage/settings.json');
const fs = require('fs').promises;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const doc = dom.window.doc;
module.exports = {
    name: "saveticket",
    alias: [],
    run: async function (client, message, args) {
        let mensaje;
        message.channel.send(new discord.MessageEmbed().setColor("RANDOM").setDescription('<a:loading_2:756293425976049674> Saving....')).then(m => mensaje = m);
        let messageCollection = new discord.Collection();
        let channelMessages = await message.channel.messages.fetch({
            limit: 100
        }).catch(err => console.log(err));
        messageCollection = messageCollection.concat(channelMessages);
        if (channelMessages.size === 100) {
            let lastMessageId = channelMessages.lastKey();
            channelMessages = await message.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
            if (channelMessages)
                messageCollection = messageCollection.concat(channelMessages);
        }
        let now = message.channel.name;
        let msgs = messageCollection.array().reverse();
        let data = await fs.readFile(__dirname + '/../storage/transcripts/plantilla.html', 'utf8').catch(err => console.log(err));
        if (data) {
            await fs.writeFile(__dirname + '/../storage/transcripts/' + now + '.html', data).catch(err => console.log(err));
            let guildElement = doc.createElement('div');
            guildElement.className = "info";
            let guildImg = doc.createElement('img');
            guildImg.setAttribute('src', message.guild.iconURL());
            guildImg.setAttribute('width', '150');
            guildImg.className = "guild_icon";
            let spanName = doc.createElement('span');
            spanName.className = "guild_name";
            let guildName = doc.createTextNode(message.guild.name);
            spanName.appendChild(guildName);
            let spanTicket = doc.createElement('span');
            spanTicket.className = "ticket_name";
            let ticketName = doc.createTextNode("#" + message.channel.name);
            spanTicket.appendChild(ticketName);
            let spanCount = doc.createElement('span');
            spanCount.className = "message_count";
            let messageCount = doc.createTextNode(messageCollection.size + " messages");
            spanCount.appendChild(messageCount);
            guildElement.appendChild(guildImg);
            guildElement.appendChild(spanName);
            guildElement.appendChild(spanTicket);
            guildElement.appendChild(spanCount);
            await fs.appendFile(__dirname + '/../storage/transcripts/' + now + '.html', guildElement.outerHTML).catch(err => console.log(err));
            msgs.forEach(async (msg) => {
                let parentContainer = doc.createElement("div");
                parentContainer.className = "parent-container";
                let avatarDiv = doc.createElement("div");
                avatarDiv.className = "avatar-container";
                let img = doc.createElement('img');
                img.setAttribute('src', msg.author.displayAvatarURL());
                img.className = "avatar";
                avatarDiv.appendChild(img);
                parentContainer.appendChild(avatarDiv);
                let messageContainer = doc.createElement('div');
                messageContainer.className = "message-container";
                let nameElement = doc.createElement("span");
                let name = doc.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString());
                nameElement.appendChild(name);
                messageContainer.append(nameElement);
                if (msg.content.startsWith("```")) {
                    let m = msg.content.replace(/```/g, "");
                    let codeNode = doc.createElement("code");
                    let textNode = doc.createTextNode(m);
                    codeNode.appendChild(textNode);
                    messageContainer.appendChild(codeNode);
                }
                else {
                    let msgNode = doc.createElement('span');
                    let textNode = doc.createTextNode(msg.content);
                    msgNode.append(textNode);
                    messageContainer.appendChild(msgNode);
                }
                parentContainer.appendChild(messageContainer);
                await fs.appendFile(__dirname + '/../storage/transcripts/' + now + '.html', parentContainer.outerHTML).catch(err => console.log(err));
            });
        }
        setTimeout(() => {
            mensaje.edit(new discord.MessageEmbed().setColor("RANDOM").setDescription(`📎 Ticket <#${message.channel.id}> saved in <#${transcriptch}>`));
            message.channel.stopTyping();
            message.guild.channels.cache.get(transcriptch).send({
                files: [{
                        attachment: '../storage/transcripts/' + now + '.html',
                        name: now + '.html'
                    }]
            }).then(console.log(`Ticket ${message.channel.name} saved`)).catch(e => {
                client.logsCh.send({
                    files: [{
                            attachment: '../storage/transcripts/' + now + '.html',
                            name: now + '.html'
                        }]
                });
                message.channel.send('Error.');
            });
        }, 5000);
    }
};
