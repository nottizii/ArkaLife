import { Message, MessageEmbed } from "discord.js";
let d = new Date()

module.exports = {
    name: "messageUpdate",
    run: async (oldM: Message, newM: Message) => {
        let client = newM.client
        if(oldM.content === newM.content) return;
        let mp;
        let nm;
        if(oldM.partial) mp = "No he podido recuperar la data del antiguo mensaje!"
        if(!oldM.partial) mp = oldM.content
        if(oldM.content.length > 1024) mp = "El contenido del mensaje era demasiado largo!"
        if(newM.content.length > 1024) nm = "El contenido del mensaje era demasiado largo!"
        const e = new MessageEmbed()
        .setTitle("Mensaje actualizado!")
        .addField("Antes:", mp, true)
        .addField("Despues:", nm, true)
        .setDescription(d.toUTCString())
        client.logs?.send(e)
        
    }
}