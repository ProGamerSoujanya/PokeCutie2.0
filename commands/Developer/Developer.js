const Discord = require("discord.js")
const Pokemon = require("../../Classes/Pokemon.js")
let gen8 = require('../../db/gen8.js')
let av = require('../../db/avatars.js')
let concept = require('../../db/concept.js')
let shadow = require('../../db/shadow.js')
let gmax = require('../../db/gmax.js')
let forms = require('../../db/forms.js')
let mg = require('../../db/mega.js')
let primal = require('../../db/primal.js')
let galar = require('../../db/galarians.js')
const { MessageEmbed, MessageCollector, Collection } = require("discord.js")
const { get } = require('request-promise-native')
const { capitalize, getlength } = require("../../functions.js")
const { readFileSync } = require('fs')
const User = require('../../models/user.js')
const Guild = require('../../models/guild.js')
const shinydb = require('../../db/shiny.js')
const megashinydb = require('../../db/mega-shiny.js')
const Gen8 = require('../../db/gen8.js')
const Galarians = require('../../db/galarians.js')
const Mega = require('../../db/mega.js')
const ShinyMega = require('../../db/mega-shiny.js')
const Shadow = require('../../db/shadow.js')
const Primal = require('../../db/primal.js')
const Altnames = require('../../db/altnames.js')
const Gmax = require('../../db/gmax.js')
const Forms = require('../../db/forms.js')
const Levelup = require('../../db/levelup.js')
const Pokemons = require('../../db/pokemon.js')
const Concept = require('../../db/concept.js')
const { classToPlain } = require("class-transformer")
const ms = require("ms")
const config = require('../../config.js')

module.exports = {
  name: "dev",
  description: "//",
  category: "developer",
  args: false,
  usage: [],
  cooldown: 0,
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let cmd
    if (args[0]) cmd = args[0].toLowerCase()

    const embed = new MessageEmbed()
      .setColor(color)
      .setAuthor("Dev Help")
      .setDescription(`\`\`\`\nThis Command Is Only For Bot Developer/Owner/bot Administrator\n\n() : Alias\n<> : Compulsory\n[] : Optional\np  : User's Pokémon\n\`\`\``)

      .addField("Suspend",
        `\`\`\`\n-> ${prefix}dev suspend <@user/userId/userName> [reason] : Suspend an user.\n`
        + `-> ${prefix}dev unsuspened <@user/userId/userName> : Unsuspend an user.\n`
        + `-> ${prefix}dev blacklist <guildId> [reason] : Blacklist a guild.\n`
        + `-> ${prefix}dev unblacklist <guildId> : Unblacklist a guild.\n\`\`\``
      )

      .addField("Balance",
        `\`\`\`\n-> ${prefix}dev givebalance(bal/credits/credit/cr) <@user/userId/userName> [amount] : Give balance to an user.\n`
        + `-> ${prefix}dev checkbalance(bal/credits/credit/cr) <@user/userId/userName> : Check an user's balance.\n\`\`\``
      )
      .addField("Redeem",
        `\`\`\`\n-> ${prefix}dev giveredeem(redeems/r) <@user/userId/userName> [amount] : Give redeem to an user.\n`
        + `-> ${prefix}dev checkredeem(redeems/r) <@user/userId/userName> : Check an user's redeems.\n\`\`\``
      )
      .addField("Shards",
        `\`\`\`\n-> ${prefix}dev giveshards(shard/sh) <@user/userId/userName> [amount] : Give shards to an user.\n`
        + `-> ${prefix}dev checkshards(shard/sh) <@user/userId/userName> : Check an user's shard count.\n\`\`\``
      )
      .addField("Votes",
        `\`\`\`\n-> ${prefix}dev givevotes(vote) <@user/userId/userName> [amount] : Give votes to an user.\n`
        + `-> ${prefix}dev checkvotes(vote) <@user/userId/userName> : Check an user's vote count.\n\`\`\``
      )
      .addField("Pokémon",
        `\`\`\`\n-> ${prefix}dev pokemonadd(pa) <@user/userId/userName> <pokémon> [--filters] : Add a pokémon to an user.\n`
        + `-> ${prefix}dev pokemoremove(pr) <@user/userId/userName> <p_Id> : Remove a pokémon from an user.\n`
        + `-> ${prefix}dev pokemonmodify(pm) <@user/userId/userName> <p_Id> [--filters] : Modify an user's pokémon.\n`
        + `-> ${prefix}dev checkpk(cp) <@user/userId/userName> [--filters] : Check an user's pokémon.\n\`\`\``
      )

    // .addField(`${prefix}dev wipe <mention/userid/name> [reason]`, `\`\`\`Clear user data from Database\`\`\``)
    // .addField(`${prefix}dev checkpf <mention/userid/name>`)


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



// SUSPEND 




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
          if (message.guild.id == `${config.server_id}`) {
            let role = message.guild.roles.cache.find(r => r.id === `${config.suspend_role}`);
            user.roles.add(role)
          }
          await userx.save()
          let suspend_embed = new MessageEmbed()
          .setTitle(`Account Suspened`)
          .setDescription(`You have been Suspended from ${client.user.username}!`)
          .addField("**Reason - **", `\`\`\`${reason}\`\`\``)
          .addField("**Join the Support Server to Appeal**", `**[Support Server Link](${config.server})**`)
          .setColor(color)
          user.send(suspend_embed).catch(e => {
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







      // UNSUSPEND







    } else if (cmd == "unsuspend") {   
      let userx = await User.findOne({ id: user.id })
      if (!userx.blacklist) return message.channel.send(`\`\`\`\nError: User is not suspended!\n\`\`\``)

      let msg = await message.channel.send(`Do you confirm to **Unsuspend** \`${u} ${user.id}\` - <@${user.id}> ?`)
      await msg.react("✅")
      msg.react("❌")

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("unsuspended")
          msg.reactions.removeAll()
          userx.blacklist = false
          if (message.guild.id == `${config.server_id}`) {
            let role = message.guild.roles.cache.find(r => r.id === `${config.suspend_role}`);
            if (message.member.roles.cache.has(role.id)) user.roles.remove(role)
          }
          await userx.save()
          let unsuspend_embed = new MessageEmbed()
          .setTitle(`Account Suspened`)
          .setDescription(`You have been Suspended from ${client.user.username}!`)
          .addField("**Join the Support Server**", `**[Support Server Link](${config.server})**`)
          .setColor(color)
          user.send(unsuspend_embed).catch(e => {
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
        if (reason == "unsuspended") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })












      // GIVEBAL 













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
          let givebal_embed = new MessageEmbed()
          .setDescription(`You have received **${amount}** balance from ${client.user.username} Team!`)
          .addField("Join the Support Server", `[Click Here](${config.server})`)
          user.send(givebal_embed).catch(e => {
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








// GIVESHARDS









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
          let giveshards_embed = new MessageEmbed()
          .setDescription(`You have received **${amount}** shards from ${client.user.username} Team!`)
          .addField("Join the Support Server", `[Click Here](${config.server})`)
          user.send(giveshards_embed).catch(e => {  if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
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
          let giveredeem_embed = new MessageEmbed()
          .setDescription(`You have received **${amount}** Redeem from ${client.user.username} Team!`)
          .addField("Join the Support Server", `[Click Here](${config.server})`)
          .setColor(color)
          user.send(giveredeem_embed).catch(e => {   if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
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










      // GIVE UPVOTES















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
          let giveupvotes_embed = new MessageEmbed()
          .setDescription(`You have received **${amount}** Upvotes from ${client.user.username} Team!`)
          .addField("Join the Support Server", `[Click Here](${config.server})`)
          .setColor(color)
          user.send(giveupvotes_embed).catch(e => {  if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("I wasn't able to DM them.")
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












      // POKEMON ADD







    } else if (cmd == "pokemonadd") {
      let userx = await User.findOne({ id: user.id })
      if (!userx) return
      // console.log(1)
      if (!args[2]) return message.channel.send("Provide a Pokémon name!")
      if (Number(args[2])) return message.channel.send("Failed to convert `Parametre` to `String`.")
      let name = args[2].toLowerCase()
      // console.log(name)
      // console.log(2)

      let url, Types
      var gene8 = gen8.find(r => r.name === name)
      var fcon = concept.find(r => r.name === name)
      var shad = shadow.find(r => r.name === name.toLowerCase().replace("shadow-", ""))
      var gigantamax = gmax.find(r => r.name === name.toLowerCase().replace("gigantamax-", ""))
      var form = forms.find(r => r.name === name)
      var mega = mg.find(r => r.name === name.toLowerCase().replace("mega-", ""))
      var prim = primal.find(r => r.name === name.toLowerCase().replace("primal-", ""))
      var gg = galar.find(r => r.name === name.toLowerCase().replace("galarian-", ""))
      // console.log(3)

      let e = message,
        n = args.join(" "),
        zbc = {}
      n.split(/--|—/gmi).map(x => {
        if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
      })
      let lvl = Math.floor(Math.random() * 31) + 1,
        hp = Math.floor(Math.random() * 31),
        atk = Math.floor(Math.random() * 31),
        def = Math.floor(Math.random() * 31),
        spatk = Math.floor(Math.random() * 31),
        spdef = Math.floor(Math.random() * 31),
        speed = Math.floor(Math.random() * 31),
        sh = false

      if (zbc['shiny']) {
        sh = true
      }
      if (zbc['level']) {
        let a = zbc["level"].split(" ")
        lvl = a[0]
      }

      if (zbc['hp']) {
        let a = zbc["hp"].split(" ")
        hpiv = a[0]
      }
      if (zbc['atk']) {
        let a = zbc["atk"].split(" ")
        atk = a[0]
      }
      if (zbc['def']) {
        let a = zbc["def"].split(" ")
        def = a[0]
      }
      if (zbc['spatk']) {
        let a = zbc["spatk"].split(" ")
        spatk = a[0]
      }
      if (zbc['spdef']) {
        let a = zbc["spdef"].split(" ")
        spdef = a[0]
      }
      if (zbc['speed']) {
        let a = zbc["speed"].split(" ")
        speed = a[0]
      }
      // console.log(4)

      let x
      if (user == client.users.cache.get(args[1])) {
        x = user.displayAvatarURL()
      } else {
        x = user.user.displayAvatarURL()
      }

      let embed = new MessageEmbed()
        .setColor(color)
      let poke

      if (prim && name.toLowerCase().startsWith("primal-")) url = prim.url, Types = prim.type
      else if (gene8) url = gene8.url, Types = gene8.type
      else if (fcon) url = fcon.url, Types = fcon.type
      else if (shad && name.toLowerCase().startsWith("shadow-")) url = shad.url, Types = shad.type
      else if (gigantamax && name.toLowerCase().startsWith("gigantamax-")) url = gigantamax.url, Types = gigantamax.type
      else if (form) url = form.url, Types = form.type
      else if (gg && name.toLowerCase().startsWith("galarian-")) url = gg.url, Types = gg.type
      else if (mega && name.toLowerCase().startsWith("mega-")) url = mega.url, Types = mega.type

      else if (!gene8 && !shad && !gigantamax && !form && !gg && !mega && !form && !fcon && !prim) {

        const options = {
          url: `https://pokeapi.co/api/v2/pokemon/${name}`,
          json: true
        }
        if (name.toLowerCase().startsWith("giratina")) options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered"
        if (name.toLowerCase().startsWith("deoxys")) options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal"
        if (name.toLowerCase().startsWith("shaymin")) options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land"
        if (name.toLowerCase() == "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
        if (name.toLowerCase == "porygon") options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z"
        if (name.toLowerCase().startsWith("porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z"
        if (name.toLowerCase().startsWith("landorus")) options.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate"
        if (name.toLowerCase().startsWith("thundurus")) options.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate"
        if (name.toLowerCase().startsWith("tornadus")) options.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate"
        if (name.toLowerCase().startsWith("mr.mime")) options.url = "https://pokeapi.co/api/v2/pokemon/mr-rime"
        if (name.toLowerCase().startsWith("pumpkaboo")) options.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average"
        if (name.toLowerCase().startsWith("meowstic")) options.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male"
        if (name.toLowerCase().startsWith("toxtricity")) options.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped"
        if (name.toLowerCase() == "mimikyu") options.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised"
        if (name.toLowerCase().startsWith("mewtwo")) options.url = "https://pokeapi.co/api/v2/pokemon/mewtwo"
        if (name.toLowerCase().startsWith("eevee")) options.url = "https://pokeapi.co/api/v2/pokemon/eevee"
        if (name.toLowerCase().startsWith("rayquaza")) options.url = "https://pokeapi.co/api/v2/pokemon/rayquaza"



        await get(options).then(async t => {

          let check = t.id.toString().length
          if (check === 1) {
            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
          } else if (check === 2) {
            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
          } else if (check === 3) {
            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
          } 
          Types = t.types.map(r => r.type.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())).join(" | ")
        })
      } else {
        return message.channel.send(`\`${name}\` pokémon doesn't seems to exist... Maybe you spelled it wrong?`)
      }



      poke = new Pokemon({ name: name, shiny: sh, url: url, rarity: Types }, lvl),
        poke.lvl = parseInt(lvl),
        poke.hp = parseInt(hp),
        poke.atk = parseInt(atk),
        poke.def = parseInt(def),
        poke.spatk = parseInt(spatk),
        poke.spdef = parseInt(spdef),
        poke.speed = parseInt(speed),
        poke.shiny = sh
      let totalIV = ((parseInt(poke.hp + poke.atk + poke.def + poke.spatk + poke.spdef + poke.speed) / 186) * 100)
      poke.totalIV = totalIV.toFixed(2),
        poke = await classToPlain(poke)
      // console.log(7)

      if (poke.shiny == true) {
        if (poke.name.toLowerCase().startsWith("mega-")) url = megashinydb.find(e => e.name === poke.name.replace("mega-", "").toLowerCase()).url
        else url = shinydb.find(e => e.name.toLowerCase() === poke.name.toLowerCase()).url
      }

      embed.setAuthor(`Adding Pokémon to ${u}. `)
      embed.setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())).replace(/-+/g, " ")}`)
      embed.setDescription(`**__Details__**\n**XP**: ${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}\n`
        + `**Types:** ${Types}\n`
        + `**Nature:** ${poke.nature}\n`
        + `**__Stats__**\n**HP:** - IV: ${poke.hp}/31\n`
        + `**Attack:** - IV : ${poke.atk}/31\n`
        + `**Defense:** - IV:${poke.def}/31\n`
        + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
        + `**Sp. Def:** - IV:${poke.spdef}/31\n`
        + `**Speed:** - IV: ${poke.speed}/31\n`
        + `**Total IV%:** ${poke.totalIV}%\n`)
      embed.setFooter(`Displaying Pokémon: ${userx.pokemons.length + 1}/${userx.pokemons.length + 1}\nTotal Pokémons: ${userx.pokemons.length + 1}`)
      embed.setThumbnail(x)
      embed.setImage(url)
      embed.setColor(color)


      let msg = await message.channel.send(embed)
      await msg.react("✅")
      msg.react("❌")
      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("added")
          await userx.markModified("pokemons")
          await userx.pokemons.push(poke)
          msg.reactions.removeAll()
          await userx.save()
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted")
          msg.reactions.removeAll()
          return message.channel.send("Ok Aborted.")
        }
      })

      collector.on("end", (userxx, reason) => {
        if (reason == "added") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        embed.setImage("https://google.com")
        return msg.edit("You didn't respond on Time! Aborted.")
      })


















      // POKEMON REMOVE











      
    } else if (cmd == "pokemonremove") {
      // console.log(1)
      let userx = await User.findOne({ id: user.id })
      if (!userx) return message.channel.send(`\`\`\`\nError: User not registered in Db.\n\`\`\``)
      let x = parseInt(args[2] - 1)
      if (x == undefined) return
      if (x > userx.pokemons.length - 1) return message.channel.send("> **User doesn't have a pokémon on that number!**")
      // console.log(x + " " + 2)

      let reason = args.slice(4).join(" ")
      if (!reason) reason = "/No Reason/"
      // console.log(reason + " " + 3)


      let level = userx.pokemons[x].level,
        hp = userx.pokemons[x].hp,
        atk = userx.pokemons[x].atk,
        def = userx.pokemons[x].def,
        spatk = userx.pokemons[x].spatk,
        spdef = userx.pokemons[x].spdef,
        speed = userx.pokemons[x].speed,
        url = userx.pokemons[x].url
      if (userx.pokemons[x].shiny == true) {
        if (userx.pokemons[x].name.toLowerCase().startsWith("mega-")) url = megashinydb.find(e => e.name === userx.pokemons[x].name.replace("mega-", "").toLowerCase()).url
        else url = shinydb.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()).url
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
        pokemon = Pokemons.find(e => e.name === userx.pokemons[x].name.toLowerCase()),
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
          userx.pokemons.splice(x, 1)
          await userx.markModified("pokemons")
          await userx.save()
          if (args[3] && args[3].toLowerCase() == "--dm") user.send(`Your ${userx.pokemons[x].shiny ? "⭐ " : ""}${userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} has been removed from your account!\nReason: **${reason}**\nJoin the Support Server to confront: [ https://discord.gg/JJpPpuVb5q ]`).catch(e => {
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
