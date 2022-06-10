const { Client, MessageEmbed, version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require("os");
let cpuStat = require("cpu-stat");
const ms = require("ms");
const v = require("./../../package.json");

module.exports = {
  name: "ping",
  category: "Information",
  description: "Know about the bot and bot developers",
  aliases: ["pg", "png"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let embed = new MessageEmbed()
      .setTitle("🏓 Ping!")
      .setDescription(`Pinging...`)
      .setColor(color)
      .setTimestamp()
      const m = await message.channel.send(embed)
      embed.setDescription(`**Bot ping:** - ${Math.round(client.ws.ping)}`)
      if(m.createdTimestamp - message.createdTimestamp > 800){
        embed.setColor(color)
      }
      else if(m.createdTimestamp - message.createdTimestamp > 120){
        embed.setColor(color)
      }
      else{
        embed.setColor(color)
      }
      return m.edit(embed);
  }}