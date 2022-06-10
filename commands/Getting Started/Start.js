const Discord = require("discord.js")
const Guild = require('../../models/guild.js')

module.exports = {
  name: "start",
  category: "Start",
  description: "Start your journey",
  usage: "start",
  aliases: ["begin"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    
    const Embed = new Discord.MessageEmbed()

	      .setColor(color)
        .setImage("https://cdn.discordapp.com/attachments/863788674016739348/869149597619081236/IMG_20210726_145950.jpg")
        .setDescription(`**Hello ${message.author.username}#${message.author.discriminator}!**\n\n**Welcome to the world of Pokémons!**\nTo begin play, choose one of these pokémon with the \`${prefix}pick <pokemon>\` command, like this: \`${prefix}pick squirtle\``)
        .addField(`Generation I`,`Bulbasaur   ・   Charmander   ・   Squirtle`)
        .addField(`Generation II`,`Chikorita   ・   Cyndaquil   ・   Totodile`)
        .addField(`Generation III`,`Treecko   ・   Torchic   ・   Mudkip`)
        .addField(`Generation IV`,`Turtwig   ・  Chimchar   ・   Piplup`)
        .addField(`Generation V`,`Snivy   ・   Tepig   ・   Oshawott`)
        .addField(`Generation VI`,`Chespin   ・   Fennekin   ・   Froakie`)
        .addField(`Generation VII`,`Rowlet   ・   Litten   ・   Popplio`)
        .addField(`Generation VIII`,`Grookey   ・   Scorbunny   ・   Sobble`)
        .setFooter("Note: Trading in-game content for IRL money or using a form of automation such as macros or selfbots to gain an unfair advantage will result in a ban from the bot. Don't cheat!")


    return message.channel.send(Embed);
  }
}