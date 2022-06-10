const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
    name: "invite",
    description: "invite the bot to your server",
    category: "miscellaneous",
    args: false,
    usage: ["invite"],
    cooldown: 3,
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {

      
      let embed = new MessageEmbed()
      .setDescription(`**[Click Here](https://discord.com/api/oauth2/authorize?client_id=928676583298977802&permissions=8&scope=bot%20applications.commands)**`)
      .setFooter("")
      .setColor(color)
      message.channel.send(embed)

    }
}