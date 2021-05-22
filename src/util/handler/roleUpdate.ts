import { TextChannel } from "discord.js";
import { Role , MessageEmbed, EmbedFieldData } from "discord.js";
let d = new Date()

module.exports = {
    name: "roleUpdate",
    run: async (role: Role, newR: Role) => {
        let client = role.client
        let arr: EmbedFieldData[] = []
        if(role.name !== newR.name) arr.push({ name: 'Nombre', value: role.name + " => " + newR.name, inline: true })
        if(role.hexColor !== newR.hexColor) arr.push({ name: 'Color', value: role.hexColor + " => " + newR.hexColor, inline: true })
        if(role.hoist !== newR.hoist) arr.push({ name: 'Se muestra por separado?', value: role.hoist + " => " + newR.hoist, inline: true })
        if(role.rawPosition !== newR.rawPosition) arr.push({ name: 'Posicion', value: role.rawPosition + " => " + newR.rawPosition, inline: true })
        arr.push({ name: "Rol", value: newR.toString(), inline: true })
        const e = new MessageEmbed()
        .setTitle("Rol edotado")
        .setDescription(d.toUTCString())
        .addFields(arr)
        let logs = client.channels.cache.get('845436480570261554') as TextChannel
        logs?.send(e)
    }
}