const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection, } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const { capitalize } = require("../../functions.js");
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
  name: "check-pf",
  description: "Dev commands",
  category: "Dev",
  args: true,
  usage: ["check-pf <user>"],
  cooldown: 3,
  permissions: [],
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    let user1 = message.mentions.members.first() || client.users.cache.get(args[0]);
    let user = await User.findOne({ id: user1.id });
    if (!user || !user.pokemons[0]) return message.channel.send(user1 + " needs to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");


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
    var selected = user.selected || 0;
    var name = user.pokemons[selected].name;
    
    var Name = name;

    let embed = new Discord.MessageEmbed()
      .setColor(color)
      .setAuthor(`${user1.username} Profile`)
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

      //.setThumbnail(message.author.displayAvatarURL())
      .setFooter("Started " + client.user.username + " On | " + time)
    return message.channel.send(embed)
  }
}
