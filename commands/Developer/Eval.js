const discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const hastebin = require("hastebin-gen");
const { uptime } = require('process');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Spawn = require('../../models/spawn.js')
const ms = require("ms");
const moment = require('moment')
let Pokemon = require('../../models/pokemons.js');
const { classToPlain } = require("class-transformer");

module.exports = {
  name: "eval",
  description: "Evals the code",
  category: "developer",
  args: false,
  usage: ["eval <code>"],
  cooldown: 3,
  aliases: [],

  execute: async (client, message, args, prefix, guild, channel) => {
    if (!args[0]) return message.channel.send("SSUP! Provide Code.")
    const code = args.join(" ");
    if (!code) code = "message.channel.send(\"Hii, Sup Provide Code Pls\")"
    const embed = new discord.MessageEmbed()
      //.addField("**Code:**", "```js\n"+code+"```")
      .setColor("#25C059")
      .setFooter("Requested By: " + message.author.tag, message.author.avatarURL({ format: 'png', dynamic: true }))

    try {
      let evaled = await eval(`(async() => { ${code} })()`);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      if (evaled.includes(client.token) && !message.author.id === config.owner) evaled.replace(client.token, "||Cencosred||")
      if (code.length > 1000) {
        const haste = await hastebin(code, { extension: "js" })
        embed.fields[0].value = `[Code](${haste})`
      }
      if (evaled.length > 1020) {

        return message.channel.send(evaled, { split: true });
        const haste = await hastebin(evaled, { extension: "txt" })
        embed.addField("**OUTPUT: **", `[Evaled File](${haste})`)
      } else {
        embed.addField("**OUTPUT: **", "```xl\n" + evaled + "```")
      }
      embed.addField("**OUTPUT TYPE: **", "```xl\n" + typeof evaled + "```")
      let msg = message.channel.send(embed)


    } catch (err) {
      if (err.length > 1000) {
        return message.channel.send(err, { split: true })
        const haste = await hastebin(err, { extension: "txt" })
        embed.addField("**ERROR: **", `[Error!](${haste})`)
      } else {
        embed.addField("**ERROR: **", "```xl\n" + err + "```")
      }
      return message.channel.send(embed)

    }
  }
}



