import { EmbedFieldData, MessageEmbed, VoiceState } from "discord.js";
let d = new Date()

module.exports = {
    name: "voiceStateUpdate",
    run: async (oldV: VoiceState, newV: VoiceState) => {
        let changes: EmbedFieldData[] = []
        if(oldV.channel == null && newV.channel !== null) changes.push({ name: "Se unió al chat:", value: newV.channel.toString(), inline: true})
        if(newV.channel == null && oldV.channel !== null) changes.push({ name: "Dejo el chat:", value: oldV.channel.toString(), inline: true})
        if(oldV.channel !== newV.channel) changes.push({ name: "Cambió de chat:", value: oldV.channel.toString() + ' => ' + newV.channel.toString(), inline: true})
        if(oldV.selfDeaf && !newV.selfDeaf) changes.push({ name: "Auto-ensordecido:", value: "No", inline: true})
        if(!oldV.selfDeaf && newV.selfDeaf) changes.push({ name: "Auto-ensordecido:", value: "Si", inline: true})
        if(oldV.selfMute && !newV.selfMute) changes.push({ name: "Auto-silenciado:", value: "No", inline: true})
        if(!oldV.selfMute && newV.selfMute) changes.push({ name: "Auto-silenciado:", value: "Si", inline: true})
        const e = new MessageEmbed()
        .setTitle("Estado de voz actualizado")
        .addFields(changes)
        newV.client.logs?.send(e)
    }
}