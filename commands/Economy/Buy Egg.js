const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
	name: "buy",
    description: "gives bot's average latency",
    category: "Miscellaneous",
    args: false,
    usage: ["buy"],
    cooldown: 3,
    permissions: [],
    aliases: [],
	execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({id: message.author.id})
    if (!user) return message.channel.send('You havent started yet!')


    if (args[0].toLowerCase() == "egg") {
      
              if (user.balance < 3001) return message.channel.send(`You don't have enough balance to buy egg`)

      user.balance = user.balance - 3000
      user.egg = user.egg + 1
      await user.save()

      return message.channel.send(`**You have successfully buyed 1 egg**`)
    }
    

	}
}