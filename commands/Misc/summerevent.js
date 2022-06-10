const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const config = require('../../config.js')
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
    name: "summerevent",
    description: "summer event",
    category: "misc",
    args: false,
    usage: ["summer"],
    cooldown: 3,
    permissions: [],
    aliases: ["sme"],
    execute: async (client, message, args, prefix, guild, color, channel) => {

      let embed = new MessageEmbed()
      .setDescription(`Summer event has started with some brand new pokemons ! We are looking forward to heat up the extra hot summer this year with the hottest pokemon. Daily Giveaway and redeem in the official server . [JOIN NOW](https://discord.gg/hPHvF8BggE) Check out the pokemons that are added ! • Maxlord
• Chariken
• Pirate-charizard
• Sandycario
• Gliding-Talonflame 
• Solunala`)
      .setColor(color)
      message.channel.send(embed)

    }
}