const Discord = require("discord.js")
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const config = require('../../config.js')

module.exports = {
  name: "bal",
  category: "Balance",
  description: "Shows balance of command user in pokecredits",
  usage: "bal",
  aliases: ["balance"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({id: message.author.id});
    if(!user) return message.channel.send (`> ${config.no} **You must pick your starter pokémon with ${prefix}start before using this command.**`);
  

    const Embed = new Discord.MessageEmbed()
	    .setColor(color)
	    .setTitle(`${message.author.tag} Balance`)
      .setDescription(`You currently have \`${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\` Credits.`)
	    .setThumbnail('https://cdn.discordapp.com/attachments/863788674016739348/875570259157979176/1628822589156.png')
      message.channel.send(Embed);    
    
  }
}