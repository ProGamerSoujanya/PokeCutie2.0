const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const { readFileSync } = require('fs')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const User = require('../../models/user.js');
const Auction = require('../../models/auctions.js');
const Guild = require('../../models/guild.js');
const legends = readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const legends2 = readFileSync("./db/legends2.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const starters = readFileSync("./db/starters.txt").toString().trim().split("\n").map(r => r.trim());
const ub = readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarians = readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Gmax = require('../../db/gmax.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const shiny = require('../../db/shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const Concept = require('../../db/concept.js');
const Canvas = require('canvas')
const ms = require("ms");

module.exports = {
  name: "a",
  description: "The Auction Hubs.",
  category: "Economy",
  args: false,
  usage: ["auction"],
  cooldown: 3,
  permissions: [],
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    const user = await User.findOne({ id: message.author.id });
    if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");

    const embed = new Discord.MessageEmbed()
    if (!args[0]) return message.channel.send(new MessageEmbed().setAuthor("◻️ All Auction Commands").setDescription("```\na = auction\np = pokémon\n() = alias/shortform\n```").addField("Usage", `**->** \`${prefix}auction search(s)  [--filters]\` = Search for Pokémons listed on the Auction Hub.\n**->** \`${prefix}auction info(i) <a_id>\` = Info the Pokémon listed on the Auction Hub.\n**->** \`${prefix}auction bid(b)  <a_id> <amount>\` = Bid a Pokémon listed on the Auction Hub.\n**->** \`${prefix}auction list(l) <p_id> <duration>\` = List your Pokémon on the Auction Hub.\n**->** \`${prefix}auction listings(lt)\` = Check all your listed Pokémons on the Auction Hub.\n**->** \`${prefix}auction remove(r)  <a_id>\` = Remove your listed Pokémon from the Auction Hub.`))


    if (message.content.toLowerCase().includes(guild.prefix + "auction listings") || message.content.toLowerCase().includes(guild.prefix + "a listings") || message.content.toLowerCase().includes(guild.prefix + "a lt") || message.content.toLowerCase().includes(guild.prefix + "auction lt") || message.content.toLowerCase().includes(guild.prefix + `auction ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `auction ${Number(args[0])} lt`) || message.content.toLowerCase().includes(guild.prefix + `a ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `a ${Number(args[0])} lt`)) {
      let all = await Auction.find({});
      all.map((r, i) => {
        r.num = i + 1;
        return r;
      });
      all = all.filter(r => r.id === user.id);
      let chunks = chunk(all, 20);

      if (all[0]) {
        if (Number(args[0]) && all[20] && message.content.toLowerCase().startsWith(`${guild.prefix}a`) || Number(args[0]) && all[20] && message.content.toLowerCase().startsWith(`${guild.prefix}auction`)) {
          if (args[0] == 0) args[0] = 1
          let chunks = chunk(all, 20);
          let index = args[0] - 1;
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          if (args[0] > chunks.length) {
            return message.channel.send("There are no Pokémons listed on the Auction Hub!")
          }
          else {
            const no = ((index + 1) * 20) - 20
            embed.setDescription(chunks[index].map((r, i) => `\`${r.num}\` **Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | IV: ${r.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(r.bid)} ${r.bid == 1 ? "Credit" : "Credits"} | Time: ${ms(r.time - Date.now())}`).join('\n') || "There are no Pokémons listed on the Auction Hub!")
            embed.setFooter(`Displaying ( Page ${index + 1} of ${chunks.length} ) of total Pokémons: ${all.length}.`);
          }
          embed.setAuthor(`${message.author.tag}'s Auction listings:`)
          embed.setColor(color)
          return message.channel.send(embed);
        }
        if (all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}a lt`) || all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}auction lt`) || all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}auction listings`) || all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}a listings`)) {
          let chunks = chunk(all, 20);
          let index = 0;
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          const no = ((index + 1) * 20) - 20
          embed.setAuthor(`${message.author.tag}'s Auction listings:`)
          embed.setDescription(chunks[index].map((r, i) => `\` ${r.num}\` **Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | IV: ${r.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(r.bid)} ${r.bid == 1 ? "Credit" : "Credits"} | Time: ${ms(r.time - Date.now())}`).join('\n') || "There are no Pokémons listed on the Auction Hub!")
          embed.setFooter(`Displaying ( Page ${index + 1} of ${chunks.length} ) of total Pokémons: ${all.length}.`)
          embed.setColor(color)
          return message.channel.send(embed);
        }
        else {
          embed
            .setAuthor(`${message.author.tag}'s Auction listings`)
            .setColor(color)
            .setDescription(chunks[index].map((r, i) => `\` ${r.num}\` **Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | IV: ${r.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(r.bid)} ${r.bid == 1 ? "Credit" : "Credits"} | Time: ${ms(r.time - Date.now())}`).join('\n') || "There are no Pokémons listed on the Auction Hub!")
            .setFooter(`Displaying ( Page ${index + 1} of ${chunks.length} ) of total Pokémons: ${all.length}.`)
          return message.channel.send(embed)
        }
      }
      else {
        return message.channel.send("You haven't listed any of your Pokémons on the Auction Hub!")
      }
    }
    else if (args[0].toLowerCase() == "remove" || args[0].toLowerCase() === "r") {
      let auction = await Auction.find({});

      auction = auction.map((r, i) => {
        r.num = i + 1;
        return r;
      }).filter(r => r.id === user.id);

      if (isNaN(args[1])) return message.channel.send(`Failed to convert \`Parametre\` to \`Int\`.`);
      if (!auction.find(r => r.num === parseInt(args[1]))) return message.channel.send(`You can't remove this Pokémon because it isn't present in your Auction Listings!`)

      let num = parseInt(args[1]) - 1;


      let data = auction.find(r => r.num === parseInt(args[1]));
      if (data.bid != 0) return message.channel.send("You can't remove your Pokemon from the Auctions once someone has Bidded on it!")

      if (data) {

        let embed = new MessageEmbed()
          .setTitle(`${client.user.username} Auction Hub`)
          .setDescription(`${message.author}\nAre you sure you want to Auction Remove your **Level ${data.pokemon.level} ${data.pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** (${data.pokemon.totalIV}% IV) ?`)
          .setFooter(
            'Remove ',
            message.author.displayAvatarURL({ format: 'png', dynamic: true })
          )
          .setColor(color)

        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");

        const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 60000 });

        collector.on('collect', async (reaction, userxx) => {
          if (reaction.emoji.name === "✅") {
            collector.stop("success");
            msg.reactions.removeAll();
            user.pokemons.push(data.pokemon);
            await user.markModified(`pokemons`);
            await user.save().catch(console.error);
            await Auction.deleteOne({ id: data.id, pokemon: data.pokemon, bid: data.bid });
            return message.channel.send(`Success.`)

          } else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            msg.reactions.removeAll();
            return message.channel.send("Ok Aborted!")
          }
        });

        collector.on("end", (userxx, reason) => {
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
      else {
        return message.channel.send(`Couldn't find an auction with that ID in your listings!`);
      }

    }

    else if (args[0].toLowerCase() == "search" || args[0].toLowerCase() == "s") {
      let auction = await Auction.find({});
      let e = message,
        n = args.slice(1).join(" "),
        a = auction,
        i = guild,
        s = a.map((r, num) => { r.pokemon.num = num + 1; return r }),
        zbc = {};
      console.log(n)
      n.split(/--|—/gmi).map(x => {
        if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
      });
      if (zbc["legendary"] || zbc["l"]) s = s.filter(e => { if (legends.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["mythical"] || zbc["m"]) s = s.filter(e => { if (mythics.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["ultrabeast"] || zbc["ub"]) s = s.filter(e => { if (ub.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["mega"] || zbc["mg"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) return e });
      if (zbc["alolan"] || zbc["a"]) s = s.filter(e => { if (alolans.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["galarian"]) s = s.filter(e => { if (galarians.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e; })
      if (zbc["shiny"] || zbc["s"]) s = s.filter(e => { if (e.pokemon.shiny) return e });
      if (zbc["name"] || zbc["n"]) s = s.filter(e => { if (e && (zbc['name'] || zbc['n']) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e });
      if (zbc['type'] || zbc["tp"]) s = s.filter(e => { if (e.pokemon.rarity.match(new RegExp((zbc['type'] || zbc["tp"]), "gmi")) != null) return e });
      if (zbc['order'] || zbc['o']) {
        let order = zbc['order'] || zbc['o'];
        if (order == "time a") {
          s = s.sort((a, b) => { return parseFloat(a.time) - parseFloat(b.time) });
        }
        else if (order == "time d") {
          s = s.sort((a, b) => { return parseFloat(b.time) - parseFloat(a.time) });
        }
        else if (order == "iv") {
          s = s.sort((a, b) => { return parseFloat(b.totalIV) - parseFloat(a.totalIV) });
        }
        else if (order == "alphabet") {
          s = s.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
          })
        }
      }
      if (zbc["hp"]) {
        let a = zbc["hp"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.hp > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.hp < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.hp == a[1]) return e });
      }
      if (zbc["atk"]) {
        let a = zbc["atk"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.atk > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.atk < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.atk == a[1]) return e });
      }
      if (zbc["def"]) {
        let a = zbc["def"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.def > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.def < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.def == a[1]) return e });
      }
      if (zbc["spatk"]) {
        let a = zbc["spatk"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spatk > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spatk < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spatk == a[1]) return e });
      }
      if (zbc["spdef"]) {
        let a = zbc["spdef"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spdef > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spdef < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spdef == a[1]) return e });
      }
      if (zbc["speed"]) {
        let a = zbc["speed"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.speed > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.speed < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.speed == a[1]) return e });
      }
      let txt;
      let num = 0
      let embed = new Discord.MessageEmbed()
      let array = [s];

      let chunks = chunk(s, 20)

      let index = 0;
      if (Number(args[1])) index = parseInt(args[1]) - 1
      let ix = ((index % chunks.length) + chunks.length) % chunks.length;
      let actualpage = index + 1
      index = ((index % chunks.length) + chunks.length) % chunks.length;
      if (isNaN(e[1])) txt = s.map((item, i) => `\`${item.pokemon.num}\` **Level ${item.pokemon.level} ${item.pokemon.shiny ? ":star: " : ""}${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | IV: ${item.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(item.bid)} ${item.bid == 1 ? "Credit" : "Credits"} | Time Left: ${ms(item.time - Date.now())}`).slice(0, 15).join("\n")

      if (Number(args[1])) {
        if (txt == "") {
          txt += "There are no Pokémons listed on the Auction Hub!"
        }
        if (chunks.length == 0) {
          chunks.length = 1
        }

        embed
          .setTitle(`${client.user.username} Auction Hub`)
          .setColor(color)
          .setDescription((chunks[index].map((item, i) => { return `\`${item.pokemon.num}\` **${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ${item.pokemon.shiny ? ":star:" : ""} | Level: ${item.pokemon.level} | IV: ${item.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(item.bid)} ${item.bid == 1 ? "Credit" : "Credits"} | Time Left: ${ms(item.time - Date.now())}`.slice(0, 15)}).join("\n")))
        if (args[1] > chunks.length) {
          embed.setDescription("There are no Pokémons listed on the Auction Hub!")
        }
        return e.channel.send(embed)
      }
      else {
        if (txt == "") {
          txt += "There are no Pokémons listed on the Auction Hub!"
        }
        if (chunks.length == 0) {
          chunks.length = 1
        }
        let embed = new Discord.MessageEmbed()
          .setTitle(`${client.user.username} Auction Hub`)
          .setColor(color)
          .setDescription(txt)
          .setFooter(`Displaying ( Page 1 of ${chunks.length} ) of total Pokémons: ${s.length} matching this search.`);
        return e.channel.send(embed)
      }

    }
    else if (args[0].toLowerCase() === "list" || args[0].toLowerCase() === "l") {
      if (isNaN(args[1])) return message.channel.send(`Invalid \`Pokémon_id\` provided. It should be in the form of \`${prefix}auction list <pokemon_id> <timeout> [buyout]\``);
      if (!args[2]) return message.channel.send(`Invalid \`Timeout\` input provided. It should be in the form of \`${prefix}auction list <pokemon_id> <timeout> [buyout]\``);

      let time = ["1m","10m","24h","3d","3days","24hours","24hour","3day"]
      if (!time.includes(args[2])) return message.channel.send(`Invalid \`Timeout\` provided, try e.g. "24h" or "3days".`);

      let num = parseInt(args[1]) - 1;

      if (!user.pokemons[num]) return message.channel.send(`Unable to find that Pokémon in your Pokedex Collection.`);

      if (user.pokemons.length < 2) return message.channel.send(`You cannot Auction list your only pokémon!`);

      let x = parseInt(ms(args[2]))
      if (!ms(args[2])) return message.channel.send(`Invalid \`Timeout\` provided, try e.g. "24h" or "3days".`)
      let t = Date.now() + ms(args[2]);
      if (x > 259200000) return message.channel.send('You cannot place your Pokémon for more than 3 days in the Auction Hubs.')

      let embed = new MessageEmbed()
        .setAuthor(`${client.user.username} Auction Hub`)
        .setDescription(`${message.author}\nYou are now Auction Listing your **Level ${user.pokemons[num].level} ${user.pokemons[num].name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** ( ${user.pokemons[num].totalIV}% IV).\n**Timeout**: ${ms(x)}`)
        .setFooter(
          'React With: ✅ To Confirm | ❌ To Abort',
          message.author.displayAvatarURL({ format: 'png', dynamic: true })
        )
        .setColor(color)

      let msg = await message.channel.send(embed);
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("success")
          msg.reactions.removeAll();

          let newDoc = new Auction({
            id: message.author.id,
            user: user.id,
            pokemon: user.pokemons[num],
            time: t,
            bid: 0,
            bidder: null
          });

          user.pokemons.splice(args[1] - 1, 1);
          await user.save().catch(e => console.log(e));
          await newDoc.save().catch(e => console.log(e));
          return message.channel.send(`Success.`);
        }
        else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          msg.reactions.removeAll();
          return message.channel.send("Ok Aborted!")
        }
      });

      collector.on("end", (userxx, reason) => {
        if (reason == "success") {
          return
        }
        if (reason == "aborted") {
          return
        }
        msg.reactions.removeAll()
        return msg.edit("You didn't respond on Time! Aborted.")
      })
    } else if (args[0].toLowerCase() == "bid" || args[0].toLowerCase() == "b") {

      console.log(1)

      let user1 = User.findOne({ id: message.author.id })
      let auction = await Auction.find({});
      let num = (parseInt(args[1]) - 1)
      console.log(2)
      let bid = parseInt(args[2]);
      console.log(3)
      if (bid > user1.balance) {
        console.log(4)
        return message.channel.send(`You don't have enough credits to bid on **Level ${auction[num].pokemon.level} ${auction[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}**!`)
      }
      console.log(5)
      if (isNaN(args[1])) return message.channel.send(`Failed to convert \`Parametre\` to \`Int\`.`)
      if (!auction[parseInt(args[1]) - 1]) return message.channel.send(`Couldn't find an auction with that ID!`)

      let userD = client.users.cache.get(auction[num].bidder)
      console.log(userD)

      let check = await Auction.findOne({ id: user.id, pokemon: auction[num].pokemon, bid: auction[num].bid });

      if (check) return message.channel.send(`You can't bid on your own Pokémon!`);
      if (auction[num].bid >= bid) return message.channel.send(`You can't bid lower than the current bid ( \`${auction[num].bid}\` ${auction[num].bid == 1 ? "Credit" : "Credits"})!`)

      let embed = new MessageEmbed()
        .setTitle(`${client.user.username} Auction Hub`)
        .setDescription(`${message.author}\nAre you sure you want to Auction Bid **Level ${auction[num].pokemon.level} ${auction[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** (${auction[num].pokemon.totalIV}% IV) ?\n**Bid**: ${bid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${bid == 1 ? "Credit" : "Credits"}`)
        .setFooter(
          'React With: ✅ To Confirm | ❌ To Abort',
          message.author.displayAvatarURL({ format: 'png', dynamic: true })
        )
        .setColor(color)

      let msg = await message.channel.send(embed);
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, userxx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop("success");
          msg.reactions.removeAll()
          user.balance = user.balance - bid
          if ((auction[num].bid > 0) && (auction[num].bid < bid)) await userD.send(`You have been outbidded on Auction Id: **${num}**.`)
          await user.save()
          await Auction.findOneAndUpdate({ id: auction[num].id }, { bid: bid }, { bidder: user1.id });
          return message.channel.send(`Success.`)
          console.log(auction[num].bidder)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          msg.reactions.removeAll();
          return message.channel.send("Ok Aborted!")
        }
      });

      collector.on("end", (userxx, reason) => {
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
    if (args[0].toLowerCase() == "info" || args[0].toLowerCase() == "i") {
      let auction = await Auction.find();
      if (isNaN(args[1])) return message.channel.send('Failed to convert `Parametre` to `Int`.')
      if (!auction[parseInt(args[1]) - 1]) return message.channel.send(`Couldn't find an auction with that ID!`)
      let a = auction,
        s = a.map((r, num) => { r.pokemon.num = num + 1; return r })


      let num = parseInt(args[1]) - 1
      let level = auction[num].pokemon.level,
        hp = auction[num].pokemon.hp,
        atk = auction[num].pokemon.atk,
        def = auction[num].pokemon.def,
        spatk = auction[num].pokemon.spatk,
        spdef = auction[num].pokemon.spdef,
        speed = auction[num].pokemon.speed,
        nb = auction[num].pokemon._nb,
        types = `${
          auction[num].pokemon.rarity
          }`,
        nature = auction[num].pokemon.nature,
        totalIV = auction[num].pokemon.totalIV,
        pokename = auction[num].pokemon.name.replace(" ", "-").toLowerCase(),
        name = `${
          auction[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          }`,
        xp = `${
          auction[num].pokemon.xp
          }/${
          ((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140
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
        url = auction[num].pokemon.url,
        bid = `${new Intl.NumberFormat('en-IN').format(auction[num].bid)} ${auction[num].bid == 1 ? "Credit" : "Credits"}`

      const gen8 = Gen8.find(e => e.name.toLowerCase() === auction[num].pokemon.name.toLowerCase()),
        form = Forms.find(e => e.name.toLowerCase() === auction[num].pokemon.name.toLowerCase()),
        concept = Concept.find(e => e.name.toLowerCase() === auction[num].pokemon.name.toLowerCase()),
        galarian = Galarians.find(e => e.name.toLowerCase() === auction[num].pokemon.name.toLowerCase().replace("galarian-", "")),
        mega = Mega.find(e => e.name.toLowerCase() === auction[num].pokemon.name.replace("mega-", "").toLowerCase()),
        shadow = Shadow.find(e => e.name.toLowerCase() === auction[num].pokemon.name.replace("shadow-", "").toLowerCase()),
        primal = Primal.find(e => e.name === auction[num].pokemon.name.replace("primal-", "").toLowerCase()),
        pokemon = Pokemon.find(e => e.name === auction[num].pokemon.name.toLowerCase()),
        gmax = Gmax.find(e => e.name.toLowerCase() === auction[num].pokemon.name.replace("gigantamax-", "").toLowerCase())

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
      } else if (galarian && auction[num].pokemon.name.toLowerCase().startsWith("galarian")) {
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
      } else if (mega && auction[num].pokemon.name.toLowerCase().startsWith("mega-")) {
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
      } else if (shadow && auction[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
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
      } else if (primal && auction[num].pokemon.name.toLowerCase().startsWith("primal-")) {
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
      } else if (gmax && auction[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
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

        if (auction[num].pokemon.name.startsWith("alolan")) {
          name = name.replace("alolan", "").trim().toLowerCase();
          name = `${name}-alola`.toLowerCase();
        }
        let t = await get({
          url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
          json: true
        }).catch((err) => {
          return message.reply("An error occured to info the pokemon. Please contact the developers of the bot!")
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

      let Embedo = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Auction Details__", `**ID**: ${num}\n**Current Bid**: ${bid}\n**Time Left**: `).setFooter(`Displaying Auction Pokémon: ${num + 1}/${
        s.length
        }\nUse "${prefix}auction bid ${num + 1}" to bid on this Pokémon.`).setImage(url).setColor(color)

      message.channel.send(Embedo).then((msgx) => {
        msgx.react("◀")
        const filter = (reaction, user) => {
          return reaction.emoji.name === "◀" && user.id === message.author.id
          let embed = new Discord.MessageEmbed()
        }

        const collector = msgx.createReactionCollector(filter, { time: 120000 })

        collector.on("collect", async (reaction, user) => {
          num = num - 1
          if (num < 0) {
            message.channel.send("Couldn't find an auction with that ID!").then(msg => msg.delete({ timeout: 5000 }))
            return reaction.users.remove(user.id)
          }
          level = auction[num].pokemon.level,
            hp = auction[num].pokemon.hp,
            atk = auction[num].pokemon.atk,
            def = auction[num].pokemon.def,
            spatk = auction[num].pokemon.spatk,
            spdef = auction[num].pokemon.spdef,
            speed = auction[num].pokemon.speed,
            nb = auction[num].pokemon._nb,
            types = `${
            auction[num].pokemon.rarity
            }`,
            nature = auction[num].pokemon.nature,
            totalIV = auction[num].pokemon.totalIV,
            pokename = auction[num].pokemon.name.replace(" ", "-").toLowerCase(),
            name = `${
            auction[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            }`,
            xp = `${
            auction[num].pokemon.xp
            }/${
            ((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140
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
            url = auction[num].pokemon.url,
            bid = `${new Intl.NumberFormat('en-IN').format(auction[num].bid)} ${auction[num].bid == 1 ? "Credit" : "Credits"}`

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
          } else if (galarian && auction[num].pokemon.name.toLowerCase().startsWith("galarian")) {
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
          } else if (mega && auction[num].pokemon.name.toLowerCase().startsWith("mega-")) {
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
          } else if (shadow && auction[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
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
          } else if (primal && auction[num].pokemon.name.toLowerCase().startsWith("primal-")) {
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
          } else if (gmax && auction[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
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
            if (auction[num].pokemon.name.startsWith("alolan")) {
              name = name.replace("alolan", "").trim().toLowerCase();
              name = `${name}-alola`.toLowerCase();
            }
            let t = await get({
              url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
              json: true
            }).catch((err) => {
              return message.reply("An error occured to info the pokemon. Please contact the developers of the bot!")
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
          reaction.users.remove(user.id)


          let embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31auction\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Auction Details__", `**ID**: ${num}\n**Current Bid**: ${bid}\n**Time Left**: `).setFooter(`Displaying auction Pokémon: ${num + 1}/${
            s.length
            }\nUse "${prefix}auction bid ${num + 1}" to bid on this Pokémon.`).setImage(url).setColor(color)
          msgx.edit(embed)
        })

        collector.on("end", (collected) => {
          msgx.reactions.removeAll().catch((r) => {
            return
          })
        })

        let emoji = "▶"
        msgx.react(emoji)
        let r1F = (reaction, user) => reaction.emoji.name === "▶" && user.id === message.author.id
        let r1 = msgx.createReactionCollector(r1F, { timer: 6000 })

        r1.on("collect", async (reaction, user) => {
          num = num + 1
          if (s.length - 1 < num) {
            message.channel.send("Couldn't find an auction with that ID!").then(msg => msg.delete({ timeout: 5000 }))
            return reaction.users.remove(user.id)
          }

          level = auction[num].pokemon.level,
            hp = auction[num].pokemon.hp,
            atk = auction[num].pokemon.atk,
            def = auction[num].pokemon.def,
            spatk = auction[num].pokemon.spatk,
            spdef = auction[num].pokemon.spdef,
            speed = auction[num].pokemon.speed,
            nb = auction[num].pokemon._nb,
            types = `${
            auction[num].pokemon.rarity
            }`,
            nature = auction[num].pokemon.nature,
            totalIV = auction[num].pokemon.totalIV,
            pokename = auction[num].pokemon.name.replace(" ", "-").toLowerCase(),
            name = `${
            auction[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            }`,
            xp = `${
            auction[num].pokemon.xp
            }/${
            ((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140
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
            url = auction[num].pokemon.url,
            bid = `${new Intl.NumberFormat('en-IN').format(auction[num].bid)} ${auction[num].bid == 1 ? "Credit" : "Credits"}`

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
          } else if (galarian && auction[num].pokemon.name.toLowerCase().startsWith("galarian")) {
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
          } else if (mega && auction[num].pokemon.name.toLowerCase().startsWith("mega-")) {
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
          } else if (shadow && auction[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
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
          } else if (primal && auction[num].pokemon.name.toLowerCase().startsWith("primal-")) {
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
          } else if (gmax && auction[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
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
            if (auction[num].pokemon.name.startsWith("alolan")) {
              name = name.replace("alolan", "").trim().toLowerCase();
              name = `${name}-alola`.toLowerCase();
            }
            let t = await get({
              url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
              json: true
            }).catch((err) => {
              return message.reply("An error occured to info the pokemon. Please contact the developers of the bot!")
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
          reaction.users.remove(user.id)


          let embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Auction Details__", `**ID**: ${num + 1}\n**Current Bid**: ${bid}\n**Time Left**: `).setFooter(`Displaying Auction Pokémon: ${num + 1}/${
            s.length
            }\nUse "${prefix}auction bid ${num + 1}" to bid on this Pokémon.`).setImage(url).setColor(color)
          msgx.edit(embed)
        })
        let emoji2 = "⏹"
        msgx.react(emoji2)
        let r2F = (reaction, user) => reaction.emoji.name === "⏹" && user.id === message.author.id
        let r2 = msgx.createReactionCollector(r2F, { timer: 6000 })

        r2.on("collect", (reaction, user) => {
          reaction.users.remove(user.id)
          message.delete()
          msgx.delete()
        })
      })
    }
  }
}
function chunk(array, chunkSize) {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temp.push(array.slice(i, i + chunkSize));
  }
  return temp;
}