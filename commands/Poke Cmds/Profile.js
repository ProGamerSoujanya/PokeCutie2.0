const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const config = require('../../config.js')
const ms = require("ms");

module.exports = {
  name: "profile",
  description: "Displays stuff available in shop",
  category: "Pokemon Commands",
  usage: ["profile"],
  cooldown: 3,
  aliases: ["pf"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });

    if (!user) return message.channel.send(`> ${config.yes} You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!`);


    if (!user.createdAt || !isNaN(user.createdAt)) user.createdAt = new Date();
    await user.save();
    var time = user.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    time = new Date(time).toISOString()
    time = time.replace("-", "T")
    time = time.replace("-", "T")
    time = time.split("T")
    time = `${time[2]}/${time[1]}/${time[0]}`;

    let e = message,
      n = args.join(" "),
      a = user,
      s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
      zbc = {};
    n.split(/--|—/gmi).map(x => {
      if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
    })
    let selected;
    if (user.selected == undefined) selected = 'None'
    else if (user.selected == null) selected = 'None'
    else {
      var name = user.pokemons[user.selected].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
      selected = `L${user.pokemons[user.selected].level} ${user.pokemons[user.selected].shiny ? "⭐ " : ""}${name} N${user.selected}`
    }


    let embed = new MessageEmbed()
      .setColor(color)
      .setAuthor(`${message.author.username} Profile`)
      .setDescription(
        `> **Balance:** \`${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} credit\`  \n`
        + `> **Redeems:** \`${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} redeem\`\n`
        + `> **Shards**: \`${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} shards\`\n`
        + `> **Pokemons Caught:** \`${user.caught.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`\n`
        + `> **Shinies Caught**: \`${user.shinyCaught.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`\n`
        + `> **Total Shinies:** \`${user.pokemons.filter(r => r.shiny).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`\n`
        + `> **Pokemons Released**: \`${user.released.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`\n`
        + `> **Total Pokémons**: \`${s.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`\n`
        + `> **Selected Pokemon**: \`${selected}\`\n`
        + `> **Vote Streak**: \`${user.upvotes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`\n`
        //+ `> **XP Booster**: -\n`
        //+ `> **Shiny Charm Expires**: -\n`
        // + `> **Badges**: ${user.badges.map(x=>x).length == 0 ? "None" : user.badges.map(x=> x)}`)
        + `> **Badges**: ${user.badges.map(r => { return client.emojis.cache.get(r) }).join(" | ") || "\`None\`"}`)

      .setThumbnail(message.author.displayAvatarURL())
      .setFooter("Started " + client.user.username + " On | " + time)
    return message.channel.send(embed)



  }
}

//
