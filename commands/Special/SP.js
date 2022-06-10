const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize, getlength } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const shinydb = require('../../db/shiny.js');
const megashinydb = require('../../db/mega-shiny.js');
const Forms = require('../../db/forms.js');
const Concept = require('../../db/concept.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const Gmax = require('../../db/gmax.js')
const ms = require("ms");

module.exports = {
  name: "sp",
  description: "//",
  category: "special",
  args: false,
  usage: [],
  cooldown: 0,
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let cmd
    if (args[0]) cmd = args[0].toLowerCase()

    const embed = new MessageEmbed()
      .setColor(color)
      .setAuthor("Special Help")
      .setDescription("This Command Is Only For Bot Developer/Owner/bot Administrator")
      .addField(`${prefix}sp suspend <mention/id/name> <reason>`, `\`\`\`suspend user from bot\`\`\``)
      .addField(`${prefix}sp unsuspend <mention/id/name>`, `\`\`\`unsuspend user from bot\`\`\``)
      .addField(`${prefix}sp givebal/giveredeem/giveshards/giveupvotes <mention/userid/name> <amount>`, `\`\`\`Give bal/redeem/shards/upvotes in user profile\`\`\``)
      .addField(`${prefix}sp pokemonadd <mention/userid/name> <pokemon> [--filters]`, `\`\`\`Give Pokemon To user in their inventory\`\`\``)
      .addField(`${prefix}sp pokemonremove <mention/userid/name> <pokemon-id>`, `\`\`\`Remove Pokemon from user inventory\`\`\``)
      .addField(`${prefix}sp wipe <mention/userid/name> <reason>`, `\`\`\`Clear user data from Database\`\`\``)
    //.addField(`${prefix}dev `)
    //.addField(`${prefix}dev `)
    //.addField(`${prefix}dev `)

    if (!args[0]) return message.channel.send(embed)
    if (!cmd) return message.channel.send(embed)

    let user = message.mentions.members.first() || client.users.cache.get(args[1]) || client.users.cache.find(x => x.username.includes(args[1]))
    if (user == undefined) {
      user = await client.users.fetch(args[1]).catch(e => {
        if (e.message.toLowerCase().includes("unknown user")) return message.channel.send("```\nError: Please mention a proper User/provide a existing User Id!\n```")
        return
      })
    }

    if (!user) return message.channel.send(`\`\`\`\nError: Provde User.\n\`\`\``)

    let u
    if (user == client.users.cache.get(args[1]) || (user == client.users.cache.find(x => x.username.includes(args[1])))) {
      u = user.tag
    } else if (user == message.mentions.members.first()) {
      u = user.user.tag
    } else {
      return message.channel.send(`\`\`\`\nError Occured\n\`\`\``)
    }

    if (cmd == "suspend") { // SUSPEND
      let userx = await User.findOne({ id: user.id })
      if (!userx) {
        await new User({ id: user.id }).save()
        userx = await User.findOne({ id: user.id })
        // userx.pokemons.push({

        // })
        // await userx.save()
      }
      let reason = args.slice(2).join(" ")
      if (!reason) reason = "/No Reason/"
      if (client.config.owners.includes(user.id)) return message.channel.send(`\`\`\`\nError: You cannot suspend other Developers!\n\`\`\``)
      if (user.id == message.author.id) return message.channel.send(`\`\`\`\nError: You cannot suspend yourself!\n\`\`\``)
      if (userx.blacklist) return message.channel.send(`\`\`\`\nError: User is already suspended!\n\`\`\``)



      let msg = await message.channel.send(`Do you confirm to **Suspend** \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("suspended")
          msg.reactions.removeAll()
          userx.blacklist = true
          if (message.guild.id == "861845860571676672"){
           let role = message.guild.roles.cache.find(r => r.id === "876137870388252762");
           user.roles.add(role)
          }
          await userx.save()
          user.send(`You have been Suspended from ${client.user.username}!\nReason: **${reason}**\nJoin the Support Server to Appeal: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
            if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
            return
          })
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "suspended") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })

    } else if (cmd == "unsuspend") {   // UNSUSPEND
      let userx = await User.findOne({ id: user.id })
      if (!userx.blacklist) return message.channel.send(`\`\`\`\nError: User is not suspended!\n\`\`\``)

      let msg = await message.channel.send(`Do you confirm to **Unsuspend** \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("suspended")
          msg.reactions.removeAll()
          userx.blacklist = false
          if (message.guild.id == "861845860571676672"){
           let role = message.guild.roles.cache.find(r => r.id === "876137870388252762");
           user.roles.remove(role)
          }
          await userx.save()
          user.send(`You have been Unsuspended from ${client.user.username}!\nJoin the Support Server: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
            if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
            return
          })
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "suspended") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })

    } else if (cmd == "givebal") { //GIVEBAL

      let userx = await User.findOne({ id: user.id })
      if (!userx) return message.channel.send(`\`\`\`\nError: User not registered in Db.\n\`\`\``)
      let amount = parseInt(args[2])

      let msg = await message.channel.send(`Do you confirm to give **${amount}** balance to \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("given")
          msg.reactions.removeAll()
          userx.balance = userx.balance + amount
          await userx.save()
          user.send(`You have received **${amount}** balance credits from ${client.user.username} Team!\nJoin the Support Server now: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
            if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
            return
          })
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "given") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })
    } else if (cmd == "giveshards") { // GIVESHARDS

      let userx = await User.findOne({ id: user.id })
      if (!userx) return message.channel.send(`\`\`\`\nError: User not registered in Db.\n\`\`\``)
      let amount = parseInt(args[2])

      let msg = await message.channel.send(`Do you confirm to give **${amount}** shards to \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("given")
          msg.reactions.removeAll()
          userx.shards = userx.shards + amount
          await userx.save()
          user.send(`You have received **${amount}** shards from ${client.user.username} Team!\nJoin the Support Server now: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
            if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
            return
          })
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "given") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })

    } else if (cmd == "giveredeem") { // GIVEREDEEM

      let userx = await User.findOne({ id: user.id })
      if (!userx) return message.channel.send(`\`\`\`\nError: User not registered in Db.\n\`\`\``)
      let amount = parseInt(args[2])

      let msg = await message.channel.send(`Do you confirm to give **${amount}** redeems to \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("given")
          msg.reactions.removeAll()
          userx.redeems = userx.redeems + amount
          await userx.save()
          user.send(`You have received **${amount}** redeem from ${client.user.username} Team!\nJoin the Support Server now: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
            if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
            return
          })
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "given") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })

    } else if (cmd == "giveupvotes") { // GIVEUPVOTES

      let userx = await User.findOne({ id: user.id })
      if (!userx) return message.channel.send(`\`\`\`\nError: User not registered in Db.\n\`\`\``)
      let amount = parseInt(args[2])

      let msg = await message.channel.send(`Do you confirm to give **${amount}** upvotes to \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("given")
          msg.reactions.removeAll()
          userx.upvotes = userx.upvotes + amount
          await userx.save()
          user.send(`You have received **${amount}** upvotes from ${client.user.username} Team!\nJoin the Support Server now: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
            if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
            return
          })
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "given") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })

    } else if (cmd == "pokemonadd") {

    } else if (cmd == "pokemonremove") {
      let userx = await User.findOne({ id: user.id })
      if (!userx) return message.channel.send(`\`\`\`\nError: User not registered in Db.\n\`\`\``)
      let x = parseInt(args[2] - 1)
      if (!x) return
      if (x > userx.pokemons.length - 1) return message.channel.send("> <:x_mark:868344397211787275> **User doesn't have a pokémon on that number!**")

      let reason = args.splice(3).join(" ")
      if (!reason) reason = "/No Reason/"


      let level = userx.pokemons[x].level,
        hp = userx.pokemons[x].hp,
        atk = userx.pokemons[x].atk,
        def = userx.pokemons[x].def,
        spatk = userx.pokemons[x].spatk,
        spdef = userx.pokemons[x].spdef,
        speed = userx.pokemons[x].speed,
        url = userx.pokemons[x].url
      if (userx.pokemons[x].shiny == true) {
        if (userx.pokemons[x].name.toLowerCase().startsWith("mega")) {
          url = megashinydb.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()).url
        }
        url = shinydb.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()).url
      }
      let types = `${
        userx.pokemons[x].rarity
        }`,
        nature = userx.pokemons[x].nature,
        totalIV = userx.pokemons[x].totalIV,
        pokename = userx.pokemons[x].name.toLowerCase().replace(" ", "-"),
        name
      if (userx.pokemons[x].shiny == true) {
        name = `⭐ ${
          userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          }`
      } else {
        name = `${
          userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          }`
      }
      let xp = `${
        userx.pokemons[x].xp
        }/${
        ((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 140
        }`,
        hpBase,
        atkBase,
        defBase,
        spatkBase,
        spdefBase,
        speedBase,
        hpTotal,
        atkTotal,
        defTotal,
        spatkTotal,
        spdefTotal,
        speedTotal,
        gen8 = Gen8.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()),
        form = Forms.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()),
        concept = Concept.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()),
        galarian = Galarians.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase().replace("galarian-", "")),
        mega = Mega.find(e => e.name.toLowerCase() === userx.pokemons[x].name.replace("mega-", "").toLowerCase()),
        shadow = Shadow.find(e => e.name.toLowerCase() === userx.pokemons[x].name.replace("shadow-", "").toLowerCase()),
        primal = Primal.find(e => e.name === userx.pokemons[x].name.replace("primal-", "").toLowerCase()),
        pokemon = Pokemon.find(e => e.name === userx.pokemons[x].name.toLowerCase()),
        gmax = Gmax.find(e => e.name.toLowerCase() === userx.pokemons[x].name.replace("gigantamax-", "").toLowerCase())

      if (gen8) {
        hpBase = gen8.hp,
          atkBase = gen8.atk,
          defBase = gen8.def,
          spatkBase = gen8.spatk,
          spdefBase = gen8.spdef,
          speedBase = gen8.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (form) {
        hpBase = form.hp,
          atkBase = form.atk,
          defBase = form.def,
          spatkBase = form.spatk,
          spdefBase = form.spdef,
          speedBase = form.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (concept) {
        hpBase = concept.hp,
          atkBase = concept.atk,
          defBase = concept.def,
          spatkBase = concept.spatk,
          spdefBase = concept.spdef,
          speedBase = concept.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (galarian && userx.pokemons[x].name.toLowerCase().startsWith("galarian")) {
        hpBase = galarian.hp,
          atkBase = galarian.atk,
          defBase = galarian.def,
          spatkBase = galarian.spatk,
          spdefBase = galarian.spdef,
          speedBase = galarian.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (mega && userx.pokemons[x].name.toLowerCase().startsWith("mega-")) {
        hpBase = mega.hp,
          atkBase = mega.atk,
          defBase = mega.def,
          spatkBase = mega.spatk,
          spdefBase = mega.spdef,
          speedBase = mega.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (shadow && userx.pokemons[x].name.toLowerCase().startsWith("shadow-")) {
        hpBase = shadow.hp,
          atkBase = shadow.atk,
          defBase = shadow.def,
          spatkBase = shadow.spatk,
          spdefBase = shadow.spdef,
          speedBase = shadow.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (primal && userx.pokemons[x].name.toLowerCase().startsWith("primal-")) {
        hpBase = primal.hp,
          atkBase = primal.atk,
          defBase = primal.def,
          spatkBase = primal.spatk,
          spdefBase = primal.spdef,
          speedBase = primal.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (gmax && userx.pokemons[x].name.toLowerCase().startsWith("gigantamax-")) {
        hpBase = gmax.hp,
          atkBase = gmax.atk,
          defBase = gmax.def,
          spatkBase = gmax.spatk,
          spdefBase = gmax.spdef,
          speedBase = gmax.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else if (pokemon) {
        hpBase = pokemon.hp,
          atkBase = pokemon.atk,
          defBase = pokemon.def,
          spatkBase = pokemon.spatk,
          spdefBase = pokemon.spdef,
          speedBase = pokemon.speed,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      } else {
        let t = await get({
          url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
          json: true
        }).catch((err) => {
          return message.reply("> <:x_mark:868344397211787275> **An Error occured!**")
        })
        hpBase = t.stats[0].base_stat,
          atkBase = t.stats[1].base_stat,
          defBase = t.stats[2].base_stat,
          spatkBase = t.stats[3].base_stat,
          spdefBase = t.stats[4].base_stat,
          speedBase = t.stats[5].base_stat,
          hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
          atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
          defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
          spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
          spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
          speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
      }

      let Embedo = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).setFooter(`Displaying Pokémon: ${x + 1}/${
        userx.pokemons.length
        }`).setImage(url).setColor(color)

      message.channel.send(Embedo)
      let msg = await message.channel.send(`Do you confirm to **Remove** the above pokémon from \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("removed")
          msg.reactions.removeAll()
          userx.pokemons.slice(x, 1)
          await userx.save()
          user.send(`Your ${userx.pokemons[x].shiny ? "⭐ " : ""}${userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} has been removed from your account!\nReason: **${reason}**\nJoin the Support Server to confront: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
            if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
            return
          })
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "removed") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })


    } else if (cmd == "wipe") {


    } else {
      return
    }
  }
}