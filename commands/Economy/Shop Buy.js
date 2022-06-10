const Discord = require("discord.js")
const { MessageEmbed, MessageCollector, Collection } = require("discord.js")
const { get } = require('request-promise-native')
const User = require('../../models/user.js')
const Guild = require('../../models/guild.js')
const { capitalize } = require('../../functions.js')
const ms = require("ms")
const Mega = require("../../db/mega.js")
const gmax = require("../../db/gmax.js")
const shadow = require("../../db/shadow.js")
let levelUp = require("../../db/levelup.js")
const Pokemon = require("../../Classes/Pokemon.js")
const { classToPlain } = require("class-transformer")
const Form = require("../../db/forms.js")
const Gmax = require("../../db/gmax.js")


module.exports = {
  name: "shopbuy",
  description: "Buy items from shop.",
  category: "Pokemon Commands",
  args: false,
  usage: ["buy <page> <item> [amount/name]"],
  cooldown: 3,
  permissions: [],
  aliases: ["shopb", "buy", "sb"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id })
    if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!")
    if (!args[0]) return message.channel.send(`\`\`\`\n${prefix}${client.commands.get("shopbuy").usage[0]}\n\`\`\``)
    let cmd = args[0].toLowerCase()


    if (cmd == "1") {
      let option = ["candy"]
      if (!args[1]) return message.channel.send(`Cmon dude! You don't wanna buy whole SHOP 1.\n\`\`\`\np!shopbuy 1 <item> [amount/name]\n\`\`\``)
      if (!option.toString().toLowerCase().includes(args[1])) return message.channel.send("Invalid item name provided.")

      if (args[1].toLowerCase() == "candy") {
        if (user.selected == null) {
          return message.channel.send("You don't have any pokémon selected!")
        } else if (user.selected == undefined) {
          return message.channel.send("You don't have any pokémon selected!")
        }
        let poke = user.pokemons[user.selected]
        let level = poke.level
        if (!args[2]) args[2] = 1
        if (!Number(args[2])) return message.channel.send('Failed to convert `Parametre` to `Int`.')
        let amount = parseInt(args[2])
       
        if (level == 100) return message.channel.send('You cannot Level up your Pokémon more than `100`!')
        if (level + amount > 100) return message.channel.send('You cannot level up your Pokémon more than `100`!')
        if (user.balance < amount * 75) return message.channel.send(`You don't have enough balance to buy \`${amount}\` ${amount == 1 ? "**Candy**" : "**Candies**"}!`)
        let embed = new MessageEmbed()
          .setDescription(`Please confirm if you would like to buy \`${amount}\` ${amount == 1 ? "**Candy**" : "**Candies**"} for \`${amount * 75}\` credits(s) ?`)
          .setColor(0x00f9ff)

        let msg = await message.channel.send(embed)

        await msg.react("✅")
        msg.react("❌")

        const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 30000 })

        collector.on('collect', async (reaction, userx) => {
          if (reaction.emoji.name === "✅") {
            collector.stop("success")
            msg.reactions.removeAll()
            for (var i = 0; i < levelUp.length; i++) {
              if (poke.helditem[0] == "everstone") return
              if (poke.name.toLowerCase() == levelUp[i].name.toLowerCase() && poke.level >= levelUp[i].levelup) {
                let evomsg = `Congratulations ${message.author}! Your \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\` has just Leveled up to ${level + 1} and evolved into **${levelUp[i].evo.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}**.`
                poke.name = capitalize(levelUp[i].evo)
                await user.markModified(`pokemons`)
                await user.save()
                return message.channel.send(evomsg)
              }
            }

            poke.level = poke.level + amount
            user.balance = user.balance - amount * 75
            await user.markModified("pokemons")
            await user.save()
            return message.channel.send(`Congratulations ${message.author}! Your \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\` has just Leveled up to ${poke.level}.`)
          } else if (reaction.emoji.name === "❌") {
            collector.stop("aborted")
            msg.reactions.removeAll()
            return message.channel.send("Ok Aborted.")
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


    } else if (cmd == "2") {

    } else if (cmd == "3") {
      if (!args[1]) return message.channel.send(`Cmon dude! You don't wanna buy whole SHOP 3.\n\`\`\`\np!shopbuy 3 <item> [amount/name]\n\`\`\``)

      if (args[1].toLowerCase() == "nature") {
        if (user.selected == null) {
          return message.channel.send("You don't have any pokémon selected!")
        } else if (user.selected == undefined) {
          return message.channel.send("You don't have any pokémon selected!")
        }
        let poke = user.pokemons[user.selected]

        let nature = ["adamant", "bashful", "brave", "bold", "calm", "careful", "docile", "gentle", "hardy", "hasty", "impish", "jolly", "lax", "lonely", "mild", "modest", "naive", "naughty", "quiet", "quicky", "rash", "relaxed", "sassy", "serious", "timid"]
        if (!args[2]) return message.channel.send("You didn't specify a nature!" + `\n` + `\`\`\`\np!shopbuy 3 nature <name>\n\`\`\``)
        if (!nature.toString().toLowerCase().includes(args[2])) return message.channel.send("Invalid nature name provided.")
        if (user.balance <= 51) return message.channel.send("You don't have enough Credits to buy `Nature Mints`!")

        poke.nature = args[2]
        await user.markModified("pokemons")
        await user.save()
        return message.channel.send("You pokémon just converted it's nature to " + `\`${args[2].toLowerCase()}\``)
      }

    } else if (cmd == "4") {
      let option = ["xp-blocker", "everstone"]
      if (!args[1]) return message.channel.send(`Cmon dude! You don't wanna buy whole SHOP 4.\n\`\`\`\np!shopbuy 4 <item> [amount/name]\n\`\`\``)
      if (!option.toString().toLowerCase().includes(args.slice(2).join("-"))) return message.channel.send("Invalid item name provided.")
      if (user.selected == null) {
        return message.channel.send("You don't have any pokémon selected!")
      } else if (user.selected == undefined) {
        return message.channel.send("You don't have any pokémon selected!")
      }
      let poke = user.pokemons[user.selected]
      if (poke.helditem && poke.helditem.length == 1) return message.channel.send("Your pokémon is already holding an item!")
      const item = args.slice(2).join("-")
      console.log(item)
      if (args[1].toLowerCase() == "item") {
        if (item == "xp-blocker") {
          poke.helditem.push("xp-blocker")
          await user.markModified("pokemons")
          await user.save()
          return message.channel.send('Your pokémon is now holding a `XP Blocker`!')
        } else if (item == "everstone") {
          poke.helditem.push("everstone")
          await user.markModified("pokemons")
          await user.save()
          return message.channel.send('Your pokémon is now holding an `Everstone`!')
        }
      }
    } else if (cmd == "5") {
      let option = ["mega", "mega-y", "mega-x", "form", "forms"]
      if (!args[1]) return message.channel.send(`Cmon dude! You don't wanna buy whole SHOP 5.\n\`\`\`\np!shopbuy 5 <item> [amount/name]\n\`\`\``)
      if (!option.toString().toLowerCase().includes(args[1])) return message.channel.send("Invalid item name provided.")
      if (user.selected == null) {
        return message.channel.send("You don't have any pokémon selected!")
      } else if (user.selected == undefined) {
        return message.channel.send("You don't have any pokémon selected!")
      }
      let poke = user.pokemons[user.selected],
        pokename = poke.name.replace(" ", "-").toLowerCase()
      // console.log(pokename)
      let mega = Mega.find(r => r.name === pokename)

      if (args[1] == "mega" && !args[2]) {
        if (user.balance < 1001) return message.channel.send("You don't have enough Credits for `Mega` transformation!")
        if (mega == undefined) {
          return message.channel.send("Your Pokémon doesn't have a `Mega` transformation!")
        } else if (mega) {
          poke.url = mega.url
          poke.name = `mega-${pokename}`
          // poke.name = poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
          poke.rarity = mega.type
          user.balance = user.balance - 1000
          await user.markModified("pokemons")
          await user.save()
          return message.channel.send(`Your Pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\``)
        } else {
          return
        }
      } else if (args[1].toLowerCase() == "mega" && args[2].toLowerCase() == "y") {
        mega = Mega.find(r => r.name.replace("-y", "") === pokename)
        if (user.balance < 1001) return message.channel.send("You don't have enough Credits for `Mega y` transformation!")
        if (mega == undefined) {
          return message.channel.send("Your Pokémon doesn't have a `Mega Y` transformation!")
        } else if (mega) {
          poke.url = mega.url
          poke.name = `mega-${pokename}-y`
          poke.rarity = mega.type
          user.balance = user.balance - 1000
          await user.markModified("pokemons")
          await user.save()
          return message.channel.send(`Your Pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\``)
        } else {
          return
        }
      } else if (args[1].toLowerCase() == "mega" && args[2].toLowerCase() == "x") {
        mega = Mega.find(r => r.name.replace("-x", "") === pokename)
        if (user.balance < 1001) return message.channel.send("You don't have enough Credits for `Mega y` transformation!")
        if (mega == undefined) {
          return message.channel.send("Your Pokémon doesn't have a `Mega X` transformation!")
        } else if (mega) {
          poke.url = mega.url
          poke.name = `mega-${pokename}-x`
          poke.rarity = mega.type
          user.balance = user.balance - 1000
          await user.markModified("pokemons")
          await user.save()
          return message.channel.send(`Your Pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\``)
        } else {
          return
        }
      } else if (args[1].toLowerCase() == "form" || args[1].toLowerCase() == "forms") {
        let formname = args.slice(2).join("-").toLowerCase()
        let form = Form.find(r => r.name === formname)
        if (form == undefined) return message.channel.send(`Your Pokémon doesn't have a ${formname.replace("-", " ")} transformation!`)
        if (!formname.endsWith(pokename)) return message.channel.send(`Your Pokémon doesn't transform into \`${formname.replace("-", " ")}\`!`)
        if (form) {
          poke.url = form.url
          poke.name = formname
          poke.rarity = form.type
          user.balance = user.balance - 1000
          await user.markModified("pokemons")
          await user.save()
          return message.channel.send(`Your Pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`!`)
        } else {
          return 
        }
      } else {
        return
      }

    } else if (cmd == "6") {

      let option = ["gigantamax", "gmax"]
      if (!args[1]) return message.channel.send(`Cmon dude! You don't wanna buy whole SHOP 6.\n\`\`\`\np!shopbuy 6 <item> [amount/name]\n\`\`\``)
      if (!option.toString().toLowerCase().includes(args[1])) return message.channel.send("Invalid item name provided.")

      if (args[1].toLowerCase() == "gigantamax" || args[1].toLowerCase() == "gmax") {
        if (!args[2]) return message.channel.send("No `<name>` provided!")
        if (user.selected == null) {
          return message.channel.send("You don't have any pokémon selected!")
        } else if (user.selected == undefined) {
          return message.channel.send("You don't have any pokémon selected!")
        }
        let poke = user.pokemons[user.selected],
          pokename = poke.name.replace(" ", "-").toLowerCase()
        if (args[2].toLowerCase() !== pokename) return message.channel.send(`Your Pokémon doesn't transform into \`${args.slice(1).join(" ").replace("-", " ")}\`!`)
        let gmax = Gmax.find(r => r.name === pokename)
        if (gmax == undefined) return message.channel.send(`Your Pokémon doesn't have a \`${args.slice(1).join(" ").replace("-", " ")}\` transformation!`)

        if (gmax) {
          poke.name = `gigantamax-${pokename}`
          poke.url = gmax.url
          poke.rarity = gmax.type
          user.balance = user.balance - 25000
          await user.markModified("pokemons")
          await user.save()
          return message.channel.send(`Your Pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`!`)
        } else {
          return
        }
      }
    } else if (cmd == "7") {
      let option = ["redeem", "incense", "pokemon"]
      if (!args[1]) return message.channel.send(`Cmon dude! You don't wanna buy whole SHOP 7.\n\`\`\`\n p!shopbuy 7 <item> [amount/name]\n\`\`\``)
      if (!option.toString().toLowerCase().includes(args[1])) return message.channel.send("Invalid item name provided.")

      if (args[1].toLowerCase() == "pokemon") {
        if (user.shards <= 99) return message.channel.send("You don't have enough Shards ( `100` ) to buy item **Pokemon.**")
        message.channel.send("Successfully Bought! 10 Rare Pokémons will be Redeemed to your account Within 60s.")
        for (var i = 0; i < 11; i++) {
          let items = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 366, 480, 481, 482, 483, 484, 485, 486, 488, 489, 490, 491, 492, 493, 494, 639, 639, 640, 641, 642, 643, 644, 645, 646, 649]
          var item = items[Math.floor(Math.random() * items.length)]
          let name = item
          let Name = name
          let url
          let a = {
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            json: true
          }

          await get(a).then(async t => {

            var re
            const Type = t.types.map(r => {
              if (r !== r) re = r
              if (re == r) return
              return `${r.type.name}`
            }).join(" | ")
            let check = t.id.toString().length

            if (check === 1) {
              url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
            } else if (check === 2) {
              url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
            } else if (check === 3) {
              url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
            }
            let lvl = Math.floor(Math.random() * 100)
            let poke = new Pokemon({ name: t.name, id: t.id, url: url, rarity: Type }, lvl)
            poke = await classToPlain(poke)

            await user.pokemons.push(poke)
            await user.markModified("pokemons")
            user.shards = user.shards - 100
            await user.save()
          })
        }
      }

      if (args[1].toLowerCase() == "incense") {
        if (user.shards < 200) return message.channel.send("You don't have enough Shards ( `1,000` ) to buy item **Incense**")
        let msg = await message.channel.send("Please Confirm if you would like to buy  **Incense** for `1,000` **Shards**?")
        await msg.react("✅")
        msg.react("❌")
        const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 })
        collector.on('collect', async (reaction, userx) => {
          if (reaction.emoji.name === "✅") {
            collector.stop("success")
            let guild = await Guild.findOne({ id: message.guild.id })
            guild.incenseamount = guild.incenseamount + 1000000000
            guild.incense = true
            await guild.save()
            user.shards = user.shards - 100000
            await user.save()
            msg.reactions.removeAll()
            return message.channel.send(`Success!`)
          }
          else if (reaction.emoji.name === "❌") {
            collector.stop("aborted")
            message.reactions.removeAll()
            msg.reactions.removeAll()
            return message.channel.send("Cancelled!")
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
      if (args[1].toLowerCase() == "redeem") {

        let amount = parseInt(args[2])
        if (!amount) {
          amount = 1
        }
        if (!Number(amount)) return message.channel.send("Failed to convert `Parametre` to `Int`.")
        if (amount > 15) return message.channel.send(`Cannot buy more than \`15\` **Redeems** at once!`)
        if (user.shards < amount * 200) {
          if (amount == "1") return message.channel.send(`You don't have enough Shards ( \`${amount * 200}\` ) to buy \`${amount}\` **Redeem**!`)
          if ((amount > "1")) return message.channel.send(`You don't have enough Shards ( \`${amount * 200}\` ) to buy \`${amount}\` **Redeems**!`)
        }

        let msg = await message.channel.send(`Do you confirm to buy ${amount} ${amount == 1 ? "**redeem**" : "**redeems**"} for ${amount * 200} shards?`)
        await msg.react("✅")
        msg.react("❌")
        const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 })
        collector.on('collect', async (reaction, userx) => {
          if (reaction.emoji.name === "✅") {
            collector.stop("success")
            user.redeems = user.redeems + amount
            user.shards = user.shards - amount * 200
            await user.save()
            message.reactions.removeAll()
            msg.reactions.removeAll()
            if (amount == "1") return message.channel.send(`Successfully bought ${amount} Redeem.`)
            else if ((amount > "1")) { return message.channel.send(`Successfully bought ${amount} Redeems.`) }
          }
          else if (reaction.emoji.name === "❌") {
            collector.stop("aborted")
            message.reactions.removeAll()
            msg.reactions.removeAll()
            return message.channel.send("Cancelled.")
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
    } else {
      return message.channel.send(`Shop Number \`${cmd}\` not found.\n\`\`\`\n${prefix}shopbuy <page> <item> [amount/name]\n\`\`\``)
    }
  }
}