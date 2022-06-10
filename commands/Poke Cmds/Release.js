const User = require("./../../models/user");
const { MessageCollector, MessageEmbed } = require("discord.js");

module.exports = {
  name: "release",
  category: "Information",
  description: "release a pokemon",
  usage: ["```\n(p = Your Pokémon)\nrelease <latest/l/0> / <p1_Id p2_Id p3_Id...> / <all>```"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    const user = await User.findOne({ id: message.author.id });
    if (!user) return message.channel.send(`> ❌ **You must pick a starter before releasing a pokemon.**`);
    let msg

    if (!args.length) return message.channel.send(module.exports.usage[0])
    if (args[0].toLowerCase() == "latest" || args[0].toLowerCase() == "l" || args[0].toLowerCase() == "0") {
      msg = `Are you sure want to release the following Pokémon?`
      let embed = new MessageEmbed()
        .addField(msg, `\`Level ${user.pokemons[user.pokemons.length - 1].level} |${user.pokemons[user.pokemons.length - 1].shiny == true ? " ⭐" : ""} ${user.pokemons[user.pokemons.length - 1].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} | ${user.pokemons[user.pokemons.length - 1].totalIV}% Iv\``)
        .setColor(color)
      let m = await message.channel.send(embed)

      await m.react("✅")
      m.react("❌")

      const collector = m.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.id) && userx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.id === "✅") {
          collector.stop("success")
          m.reactions.removeAll()
          if (user.selected == user.pokemons.length - 1) user.selected = null
          user.pokemons.pop()
          user.released = user.released + 1 
          await user.save()
          await user.markModified("pokemons")
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.id === "❌") {
          collector.stop("aborted")
          m.reactions.removeAll()
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
        m.reactions.removeAll()
        return m.edit("You didn't respond on Time! Aborted.")
      })



    } else if (args[0].toLowerCase() == "all") {
      if (user.pokemons == []) return message.channel.send("Dude! You got no Pokémon to release.")
      msg = `Are you sure want to release all your ${user.pokemons.length == 1 ? "Pokémon" : "Pokémons"} ?`
      let embed = new MessageEmbed()
        .setAuthor(msg)
        .setColor(color)
      let u = user.pokemons.map(r => `\`Level ${r.level} |${r.shiny == true ? " ⭐" : ""} ${r.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} | ${r.totalIV}% Iv\``).join("\n").toString().substr(0, 1020)
      embed.setDescription(u)
      embed.setDescription(u + `${embed.description.length >= 1021 ? "..." : " "}`)

      let m = await message.channel.send(embed)

      await m.react("✅")
      m.react("❌")

      const collector = m.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.id) && userx.id === message.author.id, { time: 30000 })

      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.id === "✅") {
          collector.stop("success")
          m.reactions.removeAll()
          user.released = user.released + user.pokemons.length -1 
          user.pokemons = []
          user.selected = null
          await user.save()
          await user.markModified("pokemons")
          return message.channel.send(`Success.`)
        } else if (reaction.emoji.id === "❌") {
          collector.stop("aborted")
          m.reactions.removeAll()
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
        m.reactions.removeAll()
        return m.edit("You didn't respond on Time! Aborted.")
      })
    } else {
      let pokes = []
      var name
      if (!args[0]) return message.channel.send(`\`\`\`\nError: No <p_Id> recevied - ${module.exports.usage[0]}\n\`\`\``)
      if (isNaN(args[0])) return message.channel.send('Failed to convert `Parametre` to `Int`.')
      num = parseInt(args[0]) - 1;
      if (num == undefined) return message.channel.send(`\`\`\`\nError: No <p_Id> recevied - ${module.exports.usage[0]}\n\`\`\``)
      name = user.pokemons[num].name;

      for (var x = 0; x < args.length; x++) {
        if (!isNaN(args[x])) {
          num = parseInt(args[x]) - 1
          name = user.pokemons[num].name
          pokes.push(user.pokemons[num])
        }
      }
      let p = "pokémon"
      if (pokes.length > 1)
        p = "pokémons"

      let embed5 = new MessageEmbed().addField(`Are you sure you want to release the following ${p}?`, pokes.map(
        r => `\`Level ${
          r.level
          } ${
          r.shiny ? "⭐ " : ""
          }${
          r.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
          } (${
          r.totalIV
          }% IV)\``
      ).join("\n")).setColor(color)

      let msg = await message.channel.send(embed5);
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 });
      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("success");

          for (var z = 0; z < pokes.length; z++) {
            pokes[z]
            if (user.pokemons.find(r => r === pokes[z])) {
              let index = user.pokemons.indexOf(pokes[z]);
              if (index > -1) {
                await user.pokemons.splice(index, 1);
                await user.markModified("pokemons");
                user.released = user.released + 1;
                user.selected = null
                await user.save();
                user.markModified("pokemons")
                msg.reactions.removeAll();
              }
            }
          }

          return message.channel.send(`Success.`)

        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          return message.channel.send("Ok Aborted.")
        }
      });

      collector.on("end", (userx, reason) => {
        if (reason == "success") {
          return
        }
        if (reason == "aborted") {
          return
        }
        m.reactions.removeAll()
        return m.edit("You didn't respond on Time! Aborted.")
      })

    }
  }
}
