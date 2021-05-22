import { EmbedFieldData, Guild , MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "guildUpdate",
    run: async (oldG: Guild, newG: Guild) => {
        if(!newG.available) return console.warn(`[ALERTA] El servidor ${newG.name} no esta disponible`)
        let client = newG.client
        let chg:EmbedFieldData[] = []
        if(oldG.name !== newG.name) chg.push({ name: "Nombre", value: oldG.name + " => " + newG.name, inline: true})
        if(oldG.iconURL() !== newG.iconURL()) chg.push({ name: "Icono", value: `[Antes](${oldG.iconURL()}) => [Ahora](${newG.iconURL()})`})
        if(oldG.verified !== newG.verified) chg.push({ name: "Verificación", value: oldG.verified ? 'Si' : 'No' + ' => ' + newG.verified ? 'Si' : 'No' , inline: true})
        let embed = new MessageEmbed()
        .setTitle("Servidor actualizado")
        .setDescription(d.toUTCString())
        .addFields(chg)
        client.logs?.send(embed)
    }
}