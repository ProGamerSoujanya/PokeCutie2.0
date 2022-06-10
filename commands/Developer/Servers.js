const { Client, MessageEmbed, version } = require("discord.js");

module.exports = {
  name: "servers",
  category: "developer",
  description: "Know about the servers",
  execute: async (client, message, args, prefix, guild, color, channel) => {
    await message.delete();

        let i0 = 0;
        let i1 = 10;
        let page = 1;
        let pages = Math.round(client.guilds.cache.size/10);
        if(pages === 0) pages = 1;

        let description = 
        `TOTAL SERVERS : ${client.guilds.cache.size}\n\n`+
        client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
        .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} MEMBERS`)
        .slice(0, 10)
        .join("\n");

        let embed = new MessageEmbed()
            .setAuthor("" + message.author.tag, message.author.avatarURL({dynamic: true}))
            .setColor(color)
            .setTitle(`PAGE: ${page}/${pages}`)
            .setDescription(description)
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setTimestamp()

        let msg = await message.channel.send(embed);
        
        await msg.react("⬅");
        await msg.react("➡");
        await msg.react("❌");

        let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

        collector.on("collect", async(reaction, user) => {            

            if(reaction._emoji.name === "⬅") {

                // Updates variables
                i0 = i0-10;
                i1 = i1-10;
                page = page-1;
                
                // if there is no guild to display, delete the message
                if(i0 < 0){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }
                
                description = `TOTAL_SERVERS : ${client.guilds.cache.size}\n\n`+
                client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members`)
                .slice(i0, i1)
                .join("\n");

                // Update the embed with new informations
                embed.setTitle(`PAGE: ${page}/${pages}`)
                .setDescription(description);
            
                // Edit the message 
                msg.edit(embed);
            
            };

            if(reaction._emoji.name === "➡"){

                // Updates variables
                i0 = i0+10;
                i1 = i1+10;
                page = page+1;

                // if there is no guild to display, delete the message
                if(i1 > client.guilds.cache.size + 10){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }

                description = `Total Servers : ${client.guilds.cache.size}\n\n`+
                client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members`)
                .slice(i0, i1)
                .join("\n");

                // Update the embed with new informations
                embed.setTitle(`PAGE: ${page}/${pages}`)
                .setDescription(description);
            
                // Edit the message 
                msg.edit(embed);

            };

            if(reaction._emoji.name === "❌"){
                return msg.delete(); 
            }

            // Remove the reaction when the user react to the message
            await reaction.users.remove(user.id)

        });
  }
}