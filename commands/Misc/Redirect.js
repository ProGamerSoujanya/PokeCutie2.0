const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");
const config = require('../../config.js')

module.exports = {
    name: "redirect",
    description: "Select a different pokemon.",
    category: "setting",
    usage: ["redirect <args> <pokemonID>"],
    cooldown: 3,
    permissions: ['MANAGE_MESSAGES'],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {

      if(!guild) {
      const server = new Guild({id: message.guild.id, prefix: null, spawnchannel: null, spawnbtn: false, levelupchannel: null, levelupbtn: null});
      await server.save();
    }

    let nguild = await Guild.findOne({ id: message.guild.id });
    let user = await User.findOne({id: message.author.id});
    if(!user){
      return message.reply(`> ${config.no} **Please pick a starter pokemons using ${nguild.prefix}start**`)
    }

    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('> ${config.no} **You need permission to use this command**')

    if(!args[0]) return message.reply(`> ${config.no} **Please specify a channel to redirect spawns using \`${nguild.prefix}redirect <channel>\` or use \`${nguild.prefix}redirect reset\` to reset redirect channel.**`)
    if(args[0].toLowerCase() == "disable"){
      nguild.spawnchannel = null;
      await nguild.save();
      return message.channel.send(`Spawns will no longer be redirected.`);
    }
     let nchannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(r=>r.name.toLowerCase().includes(args[0]))
    if(!nchannel) return message.channel.send(`> ${config.no} Correct usage: **${nguild.prefix || client.config.prefix}redirect <mentionchannel/id/name>**`);
      nguild.spawnchannel = nchannel.id;
      await nguild.save();
      return message.channel.send(`> ${config.yes} **Pokécool will now redirect all spawns to <#${nguild.spawnchannel}> To allow spawns in all channels again, type **\`${prefix}redirect disable.\``);
  }
}   