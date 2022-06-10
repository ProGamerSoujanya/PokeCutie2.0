const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require("request-promise-native");
const { capitalize } = require("../../functions.js");
const User = require("../../models/user.js");
const Guild = require("../../models/guild.js");
const ms = require("ms");

module.exports = {
  name: "shinyhunt",
  description: "You can select a specific pokémon to shiny hunt. Each time you catch that pokémon, your chain will increase. The longer your chain, the higher your chance of catching a shiny one!",
  category: "Pokemon Commands",
  args: false,
  usage: ["shinyhunt <pokemon>"],
  cooldown: 3,
  permissions: [],
  aliases: ["sh"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id })
    if (!user) return message.channel.send(`> ${config.no} **You must pick your starter pokémon with \`${prefix}start\` before using this command.**`);

    let embed = new MessageEmbed()
      .setAuthor("⭐ Shiny Hunt ")
      .setColor(color)
      .setDescription('You can select a specific pokémon to shiny hunt. Each time you catch that pokémon, your chain will increase. The longer your chain, the higher your chance of catching a shiny one!')
      .addField("Currently Hunting", `${user.shname == null ? "Type " + "`" + prefix + "shinyhunt <pokémon>" + "`" + " to begin." : `${user.shname.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`}`, true)
    user.shname == null ? "" : embed.addField("Streak", `${user.shcount}`, true)


    if (!args[0]) return message.channel.send(embed)

    try {
      if (args[0].toLowerCase() == "reset") {
        if (user.shname == null) return message.channel.send("You have no current shinyhunt!")
        let msg = await message.channel.send(`Do you confirm to reset your Shinyhunt streak of \`${user.shname.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\` (${user.shcount}) ?`)

        await msg.react("✅")
        msg.react("❌")

        const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.id) && userx.id === message.author.id, { time: 30000 })

        collector.on('collect', async (reaction, userx) => {
          if (reaction.emoji.id === "✅") {
            collector.stop("success")
            msg.reactions.removeAll()
            user.shname = null
            user.shcount = 0
            await user.save()
            return message.channel.send(`> ${config.yes} Shinyhunt Resetted!`)
          } else if (reaction.emoji.id === "❌") {
            collector.stop("aborted")
            msg.reactions.removeAll()
            message.channel.send("Cancelled.")
          }
        })
        collector.on("end", (userx, reason) => {
          if (reason == "success") {
            return
          }
          if (reason == "aborted") {
            return
          }
          msg.reactions.removeAll()
          return msg.edit("You didn't respond on Time! Aborted.")
        })
      } else {

        let Name = args.join("-").toLowerCase()
        let name = Name.toLowerCase()

        if (name.toLowerCase() == "giratina") name = "giratina-altered";
        if (name.toLowerCase().startsWith("deoxys")) name = "deoxys-normal";
        if (name.toLowerCase().startsWith("shaymin")) name = "shaymin-land";
        if (name.toLowerCase() === "nidoran") name = "nidoran-m";
        if (name.toLowerCase() === "nidoran-f") name = "nidoran-f";
        if (name.toLowerCase().startsWith(("porygon z") || "porygon-z")) name = "porygon-z";
        if (name.toLowerCase().startsWith("landorus")) name = "landorus-incarnate";
        if (name.toLowerCase().startsWith("thundurus")) name = "thunduru-incarnate";
        if (name.toLowerCase().startsWith("tornadus")) name = "tornadus-incarnate";
        if (name.toLowerCase().startsWith("mr.mime")) name = "mr-rime";
        if (name.toLowerCase().startsWith("pumpkaboo")) name = "pumpkaboo-average";
        if (name.toLowerCase().startsWith("meowstic")) name = "meowstic-male";
        if (name.toLowerCase().startsWith("toxtricity")) name = "toxtricity-amped";
        if (name.toLowerCase().startsWith("mimikyu")) name = "mimikyu-disguised  ";

        const t = await get({
          url: `https://pokeapi.co/api/v2/pokemon/${name}`,
          json: true
        })
        // console.log(1)
        let url, shiny, re
        let check = t.id.toString().length

        if (check === 1) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
        } else if (check === 2) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
        } else if (check === 3) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
        }

        const type = t.types.map(r => {
          if (r !== r) re = r;
          if (re == r) return;
          return `${capitalize(r.type.name)}`
        }).join(" | ")

        if (user.shcount == 0 || user.shname == null) {
          user.shname = name
          user.shcount = 0
          await user.save()
          return message.channel.send(`You are now Shiny Hunting \`${name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`!`)
        } else {

          let msg = await message.channel.send(`Do you confirm to reset the last Shinyhunt streak of \`${user.shname.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\` (${user.shcount}) for \`${name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`?`)

          await msg.react("✅")
          msg.react("❌")

          const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.id) && userx.id === message.author.id, { time: 30000 })

          collector.on('collect', async (reaction, userx) => {
            if (reaction.emoji.id === "✅") {
              collector.stop("success")
              msg.reactions.removeAll()
              user.shname = name
              user.shcount = 0
              await user.save()
              message.channel.send(`> ${config.yes} **You are now Shiny Hunting \`${name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`!**`)
            } else if (reaction.emoji.id === "❌") {
              collector.stop("aborted")
              msg.reactions.removeAll()
              message.channel.send("Cancelled.")
            }
          })
          collector.on("end", (userx, reason) => {
            if (reason == "success") {
              return
            }
            if (reason == "aborted") {
              return
            }
            msg.reactions.removeAll()
            return msg.edit("You didn't respond on Time! Aborted.")
          })
        }
      }
    }
    catch (error) {
      let Name = args.join("-").toLowerCase()
      let name = Name.toLowerCase()
      if (error.toString().startsWith("StatusCodeError")) return message.channel.send(`> <:x_mark:868344397211787275> **Could not find a pokémon in our Database matching \`${name}\`.**`)
      return message.channel.send(`Error! \n\`\`\`
      ${error}
      \`\`\`
      `)
    }
  }
}