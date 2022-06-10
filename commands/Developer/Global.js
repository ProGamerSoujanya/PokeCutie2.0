const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection, } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const { capitalize } = require("../../functions.js");
const Guild = require('../../models/guild.js');

module.exports = {
  name: "global",
  description: "To see the total stuffs in the bot",
  category: "developer",
  args: false,
  usage: ["global"],
  cooldown: 3,
  aliases: [],

  execute: async (client, message, args, prefix, guild, color, channel) => {
    const user = await User.find()
    let pokemons = 0
    let redeems = 0
    let balance = 0
    let shards = 0
    let bronzecrate = 0
    let silvercrate = 0
    let goldencrate = 0
    let diamondcrate = 0
    let deluxecrate = 0
    let shinyCaught = 0
    user.forEach(u=>pokemons = pokemons+u.pokemons.length)
    user.forEach(u=>redeems = redeems+u.redeems)
    user.forEach(u=>balance = balance+u.balance)
    user.forEach(u=>shards = shards+u.shards)
    user.forEach(u=>bronzecrate = bronzecrate+u.bronzecrate)
    user.forEach(u=>silvercrate = silvercrate+u.silvercrate)
    user.forEach(u=>goldencrate = goldencrate+u.goldencrate)
    user.forEach(u=>diamondcrate = diamondcrate+u.diamondcrate)
    user.forEach(u=>deluxecrate = deluxecrate+u.deluxecrate)
    user.forEach(u=>shinyCaught = shinyCaught+u.shinyCaught)
    //user.forEach(u=>silvercrate = silvercrate+u.silvercrate)
      let embed = new Discord.MessageEmbed()
      .setTitle("🌎 GLOBAL STUFFS")
      .setColor(color)
      .addField("Total Pokemons",`\`\`\`${pokemons}\`\`\``)
      .addField("Total Redeems",`\`\`\`${redeems}\`\`\``)
      .addField("Total Balance",`\`\`\`${balance}\`\`\``)
      .addField("Total Shards",`\`\`\`${shards}\`\`\``)
      .addField("Total Bronze Crate",`\`\`\`${bronzecrate}\`\`\``)
      .addField("Total Silver Crate",`\`\`\`${silvercrate}\`\`\``)
      .addField("Total Golden Crate",`\`\`\`${goldencrate}\`\`\``)
      .addField("Total Diamond Crate",`\`\`\`${diamondcrate}\`\`\``)
      .addField("Total Shiny Caught",`\`\`\`${shinyCaught}\`\`\``)
      //.addField("Total Shards",shards)
      //.addField("Total Shards",shards)
      //.addField("Total Shards",shards)
      //.addField("Total Shards",shards)
      return message.channel.send(embed);
  }
}