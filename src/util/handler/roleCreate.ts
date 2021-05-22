import { Role , MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "roleCreate",
    run: async (role: Role) => {
        let client = role.client
        const e = new MessageEmbed()
        .setTitle("Rol creado")
        .setDescription(d.toUTCString())
        .addFields([
            { name: 'Nombre', value: role.name, inline: true },
            { name: 'Color', value: role.hexColor, inline: true },
            { name: 'Mostrar por separado?', value: role.hoist, inline: true },
            { name: 'Posición', value: role.position, inline: true },
            { name: 'Rol', value: role.toString(), inline: true }
        ])
        client.logs.send(e)
    }
}