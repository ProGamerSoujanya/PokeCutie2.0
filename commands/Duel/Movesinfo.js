const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require('../../functions.js')
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "moveinfo",
  description: "Display your pokemon's moves and movepool.",
  category: "Pokemon Commands",
  args: false,
  usage: ["moveinfo <move#name>"],
  cooldown: 3,
  permissions: [],
  aliases: ["mi"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });
    if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
    if (!args[0]) return message.channel.send(`\`\`\`\nError! No Move Received.\n\`\`\`\`${prefix}moveinfo <move#name>\``)
    let move = args.join("-").toLowerCase();
    let a = {
      url: `https://pokeapi.co/api/v2/move/${move}`,
      json: true
    }

    await get(a).then(async t => {

      let embed = new Discord.MessageEmbed()
        .setAuthor(`#${t.id} - ${t.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`)
        .addField("Generation", `${t.generation.name.replace("generation-", " ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`)
        .addField("Power", t.power)
        .addField("Accuracy", t.accuracy)
        .addField("PP", t.pp)
        .addField("Priority", t.priority)
        .addField("Type", `${t.type.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`)
        .addField("Category",`${t.damage_class.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`)
        .setColor(color)

     return message.channel.send(embed)

    }).catch(err => {
      if (err.message.toLowerCase().startsWith('404')) return message.channel.send("This Move doesn't seem to appear or maybe you spelled it Wrong!");

  })
  }
  
}

// let embed = new Discord.MessageEmbed
//     .setAuthor(`Move Info: ${t.name.replace("-"," ")}`)
//     .addField("Power", `${t.power}`)
//     .addField("Accuracy",`${t.accuracy}`)
//     .addField("PP",`${t.pp}`)
//     .addField("Priority",`0`)
//     .addField("Move Type",`${t.damange_class.name}`)
//     .addField("Move Category",`${t.damange_class.category}`)
