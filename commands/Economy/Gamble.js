const User = require("./../../models/user");
const { MessageCollector, MessageEmbed } = require("discord.js");

module.exports = {
  name: "dj",
  category: "Pokemon Commands",
  description: "Gamble",
  usage: ["```\n() = Alias\ngamble(bet) <@user/userId/userName> [amount/max(all)]\n```"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    if (!args.length) return message.channel.send(module.exports.usage[0])


    let mentionUser = message.mentions.members.first() || client.users.cache.get(args[0]) || client.users.cache.find(x => x.username == args[0]) || client.users.cache.find(x => x.tag == args[0])
    if (!mentionUser) return message.channel.send("Failed to fetch `Parametre` = `User`" + "\n" + module.exports.usage[0])

    let u
    if (mentionUser == client.users.cache.get(args[0]) || (mentionUser == client.users.cache.find(x => x.username == args[0])) || (mentionUser === client.users.cache.find(x => x.tag == args[0]))) {
      u = mentionUser.tag
    } else if (mentionUser == message.mentions.members.first()) {
      u = mentionUser.user.tag
    } else {
      return message.channel.send(`\`\`\`\nError Occured.\n\`\`\``)
    }

    // Author
    const user = await User.findOne({ id: message.author.id });
    if (!user) return message.channel.send(`> <:x_mark:868344397211787275> **You need to pick a starter pokémon using the \`${prefix}start\` command before using this command!**`);
    // Opponent
    let userx = await User.findOne({ id: mentionUser.id })
    if (!userx) return message.channel.send(`> <:x_mark:868344397211787275> **${u}** needs to pick a starter pokémon using the \`${prefix}start\` command before using this command!`);


    if (!args[1]) args[1] = Number(1)
    if (isNaN(args[1])) return message.channel.send('Failed to convert `Parametre` to `Int`.')
    let amount = parseInt(args[1])

    function getRandomNumberBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    let random = getRandomNumberBetween(1, 10)
    if (random <= 5) result = "Author"
    else result = "Opponent"
    // console.log(result)

    let msg = await message.channel.send(`${u}, ${message.author.tag} has requested to gamble ${amount} credits with you. Type \`${prefix}join ${guild.bets}\` to join.`)

    const collector = msg.channel.createMessageCollector(m => m.content.toLowerCase() == `${prefix}join ${guild.bets}`, { time: 60000 })

    collector.on('collect', async m => {
      guild.bets = guild.bets + 1
      await guild.save()
      if (m.author.id === mentionUser.id) {
         collector.stop("mentioned")
        return message.channel.send(`${u} joined ${message.author.tag}'s gamble!`)
      }
      if (m.author.id === message.author.id) {
         collector.stop("author")
        return message.channel.send(`${message.author.tag}, you joined your gamble!`)
      } 
    });

    collector.on('end', (r, reason) => {
      if (reason === 'author') {
        return message.channel.send(`${message.author.tag} won.`)
      } else if (reason == "mentioned") {
        return message.channel.send(`${u} won.`)
      }
    });
  }
}