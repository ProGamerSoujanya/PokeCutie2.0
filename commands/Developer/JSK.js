const Discord = require("discord.js")
const Guild = require('../../models/guild.js')
const User = require('../../models/user.js')

module.exports = {
  name: "jsk",
  category: "developer",
  args: "false",
  description: "/",
  usage: "/",
  aliases: ["jishaku"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    let embed = new Discord.MessageEmbed()
      .setAuthor("JSK PSU Help")
      .addField("Check Balance", `${prefix}jsk psu <--id userid/--user @user> --check**bal/balance/credit/credits**`)
      .addField("Check Shards", `${prefix}jsk psu <--id userid/--user @user> --check**shards/shard/sh**`)
      .addField("Check Redeems", `${prefix}jsk psu <--id userid/--user @user> --check**redeem/redeems/r**`)
      .addField("Check Pokemon Info", `${prefix}jsk psu <--id userid/--user @user> --check**pokemoninfo/pokemoni/pinfo/pi**`)
      .setColor(color)

    if (!args[1]) return message.channel.send(embed)
    if (!args[2]) return message.channel.send(embed)
    if (!args[3]) return message.channel.send(embed)

    if ((args[0].toLowerCase() == "psu" || args[0].toLowerCase() == "putussibau") && (args[1].toLowerCase() == "--id" || args[1].toLowerCase() == "--user")) {
      let id = client.users.cache.get(args[2]) || message.mentions.members.first()
      if (!id) return

      let u, x

      if (id == client.users.cache.get(args[2])) {
        x = id.displayAvatarURL()
        u = id.tag
      } else {
        u = id.user.tag
        x = id.user.displayAvatarURL()
      }
      let user = await User.findOne({ id: id.id })
      if (!user) return

      let cmd = args[3].toLowerCase()
      if (!cmd) return

      if (cmd == "--checkpf" || cmd == "--checkprofile") {
        let embed = new Discord.MessageEmbed()
          .setAuthor(`Displaying ${u}'s Profile'`)
          .setDescription(
            `**Balance**: ${user.balance}\n` +
            `**Redeems**: ${user.redeems}\n` +
            `**Shards**: ${user.shards}\n` +
            `**Pokémons Caught**: ${user.caught.length}\n` +
            `**Total Pokémons**: ${user.pokemons.length}\n` +
            `**Pokémons Released**: ${user.released}\n`
          )
          .setThumbnail(x)
          .setColor(color)
        return message.channel.send(embed)

      } else if (cmd == "--checkpk") {

      } else if (cmd == "--checkpi" || cmd == "--checkpokemoninfo" || cmd == "--checkpinfo" || cmd == "--checkpokemoni") {

        let num = parseInt(args[4])
        num = num - 1

        if (num > user.pokemons.length) return message.channel.send(`${u} doesn't have a Pokemon with that Number.`)



        let Embed = new Discord.MessageEmbed()
        Embed.setColor(color)
        Embed.setAuthor(`Showing ${u}'s Pokémon Info:'`)
        Embed.setTitle(`${(user.pokemons[num].shiny ? "⭐ " : "")} ${user.pokemons[num].name.replace(/\b\w/g, l => l.toUpperCase())}`)
        Embed.setDescription(`${(user.pokemons[num].nick != null ? `**Nickname:** ${user.pokemons[num].nick}` : "")}\n**Level:**  ${user.pokemons[num].level} | **XP:** ${user.pokemons[num].xp}\n**Type:** ${user.pokemons[num].rarity}\n**Nature:** ${user.pokemons[num].nature}\n\n**HP:** - IV : ${user.pokemons[num].hp}/31\n**Attack:** - IV: ${user.pokemons[num].atk}/31\n**Defense:** - IV: ${user.pokemons[num].def}/31\n**Sp. Atk:** - IV: ${user.pokemons[num].spatk}/31\n**Sp. Def:** - IV: ${user.pokemons[num].spdef}/31\n**Speed:** - IV: ${user.pokemons[num].speed}/31\n**Total IV %:** ${user.pokemons[num].totalIV}%`)
        Embed.setImage(user.pokemons[num].url)
        Embed.setThumbnail(x)
        Embed.setFooter(`Dislaying Pokémon : ${num + 1}/${user.pokemons.length}`)
        return message.channel.send(Embed)


      } else if (cmd == "--checkbal" || cmd == "--checkbalance" || cmd == "--checkcredits" || cmd == "--checkcredit") {

        let Embed = new Discord.MessageEmbed()
          .setColor(color)
          .setAuthor(`${u}'s Balance`)
          .setDescription(`He currently has ${user.balance} ${user.balance == 0 ? "Credit" : "Credits"}.`)
          .setThumbnail('https://media.discordapp.net/attachments/863788674016739348/868798182786744390/1627208004507.png')
        return message.channel.send(Embed);

      } else if (cmd == "--checkredeem" || cmd == "--checkredeems" || cmd == "--checkr") {

        let Embed = new Discord.MessageEmbed()
          .setColor(color)
          .setAuthor(`${u}'s Redeems`)
          .setDescription(`He currently has ${user.redeems} ${user.balance == 0 ? "Redeem" : "Redeems"}.`)
          .setThumbnail('https://media.discordapp.net/attachments/863788674016739348/868798182786744390/1627208004507.png')
        return message.channel.send(Embed);

      } else if (cmd == "--checkshards" || cmd == "--checkshard" || cmd == "--checksh") {

        let Embed = new Discord.MessageEmbed()
          .setColor(color)
          .setAuthor(`${u}'s Shards`)
          .setDescription(`He currently has ${user.shards} ${user.balance == 0 ? "Shard" : "Shards"}.`)
          .setThumbnail('https://media.discordapp.net/attachments/863788674016739348/868798182786744390/1627208004507.png')
        return message.channel.send(Embed);

      } else {
        let embed = new Discord.MessageEmbed()
          .setAuthor("JSK PSU Help")
          .addField("Check Balance", `${prefix}jsk psu <--id userid/--user @user> --check**bal/balance/credit/credits**`)
          .addField("Check Shards", `${prefix}jsk psu <--id userid/--user @user> --check**shards/shard/sh**`)
          .addField("Check Redeems", `${prefix}jsk psu <--id userid/--user @user> --check**redeem/redeems/r**`)
          .addField("Check Pokemon Info", `${prefix}jsk psu <--id userid/--user @user> --check**pokemoninfo/pokemoni/pinfo/pi**`)
          .setColor(color)
        return message.channel.send("Incorrect Usage, Try from these:" ,embed)
      }
    } else {
      return message.channel.send(embed)
    }
  }
}