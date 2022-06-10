const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const { readFileSync } = require('fs')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const User = require('../../models/user.js');
const Market = require('../../models/market.js');
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
  name: "market",
  description: "Market",
  category: "Economy",
  args: false,
  usage: [],
  cooldown: 3,
  permissions: [],
  aliases: ["m"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    if (!args[0]) return message.channel.send(new MessageEmbed().setAuthor("◻️ All Market Commands").setDescription("```\nm = market\np = pokémon\n() = alias/shortform\n```").addField("Usage", `**->** \`${prefix}market search(s)  [--filters]\` = Search for Pokémons listed on market.\n**->** \`${prefix}market info(i) <m_id>\` = Info the Pokémon listed on markets.\n**->** \`${prefix}market buy(b)  <m_id>\` = Buy a Pokémon from the markets.\n**->** \`${prefix}market list(l) <p_id> <amount>\` = List your Pokémon on the market resorts.\n**->** \`${prefix}market listings(lt)\` = Check all your listed Pokémons.\n**->** \`${prefix}market remove(r)  <m_id>\` = Remove your Listed Pokémon from the markets.`))

    const user = await User.findOne({ id: message.author.id });
    const embed = new Discord.MessageEmbed()
    if (!user) return message.channel.send(`Please pick a starter before using this command.`);

    //market listings 
    if (message.content.toLowerCase().includes(guild.prefix + "market listings") || message.content.toLowerCase().includes(guild.prefix + "m listings") || message.content.toLowerCase().includes(guild.prefix + "m lt") || message.content.toLowerCase().includes(guild.prefix + "market lt") || message.content.toLowerCase().includes(guild.prefix + `market ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `market ${Number(args[0])} lt`) || message.content.toLowerCase().includes(guild.prefix + `m ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `m ${Number(args[0])} lt`)) {
      // if ((args[0].toLowerCase() == "lt" || args[0].toLowerCase() == "listings") || (Number(args[0]) && args[1].toLowerCase() == "lt")){

      let all = await Market.find({});
      all.map((r, i) => {
        r.num = i + 1;
        return r;
      });
      all = all.filter(r => r.id === user.id);
      let chunks = chunk(all, 20);

      if (all[0]) {
        if (Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}m`) || Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}market`)) {
          //    if(args[0] == 0) args[0]; 
          let chunks = chunk(all, 20);
          let index = args[0] - 1;
          //   if(index) index;
          //   console.log(chunks[0]);
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          //   const no = ((ix + 1)*20)-20
          embed
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          if (args[0] > chunks.length) {
            embed.setDescription(`There is Nothing listed on the Markets`)
          }
          else {
            const no = ((index + 1) * 20) - 20
            embed.setDescription(chunks[index].map((r, i) => `\`${r.num}\` **Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐ " : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | **IV**: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} Credit(s)`).join('\n') || "There is no pokemon in market")
            embed.setFooter(`Showing ${index + 1}-${chunks.length} of total ${all.length} Pokémons matching this search.`);
          }
          embed.setAuthor(`${message.author.tag}'s' Market Listings`)
          embed.setColor(color)
          return message.channel.send(embed);
        }
        if (all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}m lt`) || all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}market lt`) || all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}market listings`) || all[20] && message.content.toLowerCase().endsWith(`${guild.prefix}m listings`)) {
          //    if(args[0] == 0) args[0]; 
          let chunks = chunk(all, 20);
          let index = 0;
          //   if(index) index;
          //   console.log(chunks[0]);
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          //   const no = ((ix + 1)*20)-20
          embed
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          const no = ((index + 1) * 20) - 20
          embed.setAuthor(`${message.author.tag}'s Market Listings`)
          embed.setDescription(chunks[index].map((r, i) => `\`${r.num}\` **Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐ " : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} Credit(s)`).join('\n') || "There is no pokemon in market")
          embed.setFooter(`Showing ( page ${index + 1} - ${chunks.length} ) of total ${all.length} Pokémons matching this search.`)
          embed.setColor(color)
          return message.channel.send(embed);
        }
        else {
          embed
            .setAuthor(`${message.author.tag}'s Market Listings`)
            .setColor(color)
            .setDescription(chunks[0].map((r, i) => `\`${r.num}\` **Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐ " : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} Credit(s)`).join('\n') || "There is no pokemon in market")
            .setFooter(`Showing ( page 1 - 1 ) of total ${all.length} Pokémons matching this search.`);
          message.channel.send(embed)
        }
      }
      else {
        return message.channel.send("You don't have any Pokemon listed on the Markets.")
      }

      //Market remove
    } else if (args[0].toLowerCase() == "remove") {

      let market = await Market.find({});
      market = market.map((r, i) => {
        r.num = i + 1;
        return r;
      }).filter(r => r.id === user.id);

      if (isNaN(args[1])) return message.channel.send(`Failed to convert \`Parametre\` to \`Int\`.`);
      if (!market.find(r => r.num === parseInt(args[1]))) return message.channel.send(`You can't remove this Pokémon because it isn't present in your Market Listings!`)

      let num = parseInt(args[1]) - 1;
      let data = market.find(r => r.num === parseInt(args[1]));



      if (data) {

        let embed = new MessageEmbed()
          .setTitle(`🛒 PokéCool Market`)
          .setDescription(`${message.author}\nAre you sure you want to Market Remove your **Level ${data.pokemon.level} ${data.pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** (${data.pokemon.totalIV}% IV) ?`)
          .setFooter(
            'React With: ✅ To Confirm | ❌ To Abort\n',
            message.author.displayAvatarURL({ format: 'png', dynamic: true })
          )
          .setColor(color)

        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");


        const collector = msg.createReactionCollector((reaction, userxx) => ['✅', '❌'].includes(reaction.emoji.name) && userxx.id === message.author.id, { time: 60000 });

        collector.on('collect', async (reaction, userxx) => {
          if (reaction.emoji.name === "✅") {
            collector.stop();
            msg.reactions.removeAll()
            user.pokemons.push(data.pokemon);
            await user.markModified(`pokemons`);

            await user.save()

            await Market.deleteOne({ id: data.id, pokemon: data.pokemon, price: data.price });
            return message.channel.send(`Successfully Removed!`)

          } else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            msg.reactions.removeAll();
            return message.channel.send("Remove Cancelled!")
          }
        });

        collector.on('end', collected => {
          return;
        });

      }
      else {
        return message.channel.send(`You can't remove this Pokémon because it isn't present in your Market Listings`);
      }
    } else if (args[0].toLowerCase() == "info" || args[0].toLowerCase() == "i" || args[0].toLowerCase() === "view" || args[0].toLowerCase() === "v") {
      let market = await Market.find({});
      if (isNaN(args[1])) return message.channel.send('Failed to convert `Parametre` to `Int`.')
      if (!market[parseInt(args[1]) - 1]) return message.channel.send(`You can't **info** this Pokémon because it isn't present in the Market Listings!`)

      let a = market,
        s = a.map((r, num) => { r.pokemon.num = num + 1; return r })

      let num = parseInt(args[1]) - 1
      let level = market[num].pokemon.level,
        hp = market[num].pokemon.hp,
        atk = market[num].pokemon.atk,
        def = market[num].pokemon.def,
        spatk = market[num].pokemon.spatk,
        spdef = market[num].pokemon.spdef,
        speed = market[num].pokemon.speed,
        nb = market[num].pokemon._nb,
        types = `${
          market[num].pokemon.rarity
          }`,
        nature = market[num].pokemon.nature,
        totalIV = market[num].pokemon.totalIV,
        pokename = market[num].pokemon.name.replace(" ", "-").toLowerCase(),
        name = `${
          market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          }`,
        xp = `${
          market[num].pokemon.xp
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
        url = market[num].pokemon.url,
        price = `${new Intl.NumberFormat('en-IN').format(market[num].price)} Credit(s)`

      const gen8 = Gen8.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
        form = Forms.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
        concept = Concept.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
        galarian = Galarians.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase().replace("galarian-", "")),
        mega = Mega.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("mega-", "").toLowerCase()),
        shadow = Shadow.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("shadow-", "").toLowerCase()),
        primal = Primal.find(e => e.name === market[num].pokemon.name.replace("primal-", "").toLowerCase()),
        pokemon = Pokemon.find(e => e.name === market[num].pokemon.name.toLowerCase()),
        gmax = Gmax.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("gigantamax-", "").toLowerCase())

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
      } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
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
      } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
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
      } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
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
      } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
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
      } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
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

        if (market[num].pokemon.name.startsWith("alolan")) {
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

      let Embedo = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${
        s.length
        }\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)

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
            message.channel.send("Market doesn't have any less Pokémons!").then(msg => msg.delete({ timeout: 5000 }))
            return reaction.users.remove(user.id)
          }
          level = market[num].pokemon.level,
            hp = market[num].pokemon.hp,
            atk = market[num].pokemon.atk,
            def = market[num].pokemon.def,
            spatk = market[num].pokemon.spatk,
            spdef = market[num].pokemon.spdef,
            speed = market[num].pokemon.speed,
            nb = market[num].pokemon._nb,
            types = `${
            market[num].pokemon.rarity
            }`,
            nature = market[num].pokemon.nature,
            totalIV = market[num].pokemon.totalIV,
            pokename = market[num].pokemon.name.replace(" ", "-").toLowerCase(),
            name = `${
            market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            }`,
            xp = `${
            market[num].pokemon.xp
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
            url = market[num].pokemon.url,
            price = `${new Intl.NumberFormat('en-IN').format(market[num].price)} Credit(s)`

          const gen8 = Gen8.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
            form = Forms.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
            concept = Concept.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
            galarian = Galarians.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase().replace("galarian-", "")),
            mega = Mega.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("mega-", "").toLowerCase()),
            shadow = Shadow.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("shadow-", "").toLowerCase()),
            primal = Primal.find(e => e.name === market[num].pokemon.name.replace("primal-", "").toLowerCase()),
            pokemon = Pokemon.find(e => e.name === market[num].pokemon.name.toLowerCase()),
            gmax = Gmax.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("gigantamax-", "").toLowerCase())

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
          } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
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
          } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
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
          } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
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
          } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
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
          } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
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
            if (market[num].pokemon.name.startsWith("alolan")) {
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


          let embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${
            s.length
            }\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)
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
            message.channel.send("Market doesn't have any more Pokémons!").then(msg => msg.delete({ timeout: 5000 }))
            return reaction.users.remove(user.id)
          }

          level = market[num].pokemon.level,
            hp = market[num].pokemon.hp,
            atk = market[num].pokemon.atk,
            def = market[num].pokemon.def,
            spatk = market[num].pokemon.spatk,
            spdef = market[num].pokemon.spdef,
            speed = market[num].pokemon.speed,
            nb = market[num].pokemon._nb,
            types = `${
            market[num].pokemon.rarity
            }`,
            nature = market[num].pokemon.nature,
            totalIV = market[num].pokemon.totalIV,
            pokename = market[num].pokemon.name.replace(" ", "-").toLowerCase(),
            name = `${
            market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            }`,
            xp = `${
            market[num].pokemon.xp
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
            url = market[num].pokemon.url,
            price = `${new Intl.NumberFormat('en-IN').format(market[num].price)} Credit(s)`


          const gen8 = Gen8.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
            form = Forms.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
            concept = Concept.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()),
            galarian = Galarians.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase().replace("galarian-", "")),
            mega = Mega.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("mega-", "").toLowerCase()),
            shadow = Shadow.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("shadow-", "").toLowerCase()),
            primal = Primal.find(e => e.name === market[num].pokemon.name.replace("primal-", "").toLowerCase()),
            pokemon = Pokemon.find(e => e.name === market[num].pokemon.name.toLowerCase()),
            gmax = Gmax.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("gigantamax-", "").toLowerCase())

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
          } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
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
          } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
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
          } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
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
          } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
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
          } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
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
            // if (market[num].pokemon.name.startsWith("alolan")) {
            //   name = name.replace("alolan", "").trim().toLowerCase();
            //   name = `${name}-alola`.toLowerCase();
            // }
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


          let embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${
            s.length
            }\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)
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

    else if (args[0].toLowerCase() === "list") {
      if (isNaN(args[1])) return message.channel.send(`Invalid \`Pokémon_id\` provided. It should be in the form of \`${prefix}market list <pokemon_id> <price>\``);
      let num = parseInt(args[1]) - 1;
      if (!user.pokemons[num]) return message.channel.send(`Unable to find that Pokémon in your Pokedex Collection.`);
      if (user.pokemons.length == 1) return message.channel.send(`You cannot Market list your only Pokémon!`);

      if (!args[2]) return message.channel.send(`Invalid Credit(s) input provided. It should be in the form of \`${prefix}market list <pokemon_id> <price>\``)
      if (isNaN(args[2])) {
        return message.channel.send(`\`${args[2]}\` is not a valid Integer`);
      }
      if ((args[2]) > 10000000) {
        return message.channel.send(`You cannot List your Pokémon on the Market for more than **\`10,000,000\`** Credit(s). Please Try Again!`);
      }
      let embed = new MessageEmbed()
        .setAuthor("🛒 PokéCool Market")
        .setDescription(`${message.author}\nYou are now Market Listing your **Level ${user.pokemons[num].level} ${user.pokemons[num].name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** ( ${user.pokemons[num].totalIV}% IV).\n**Price**: ${args[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s)`)
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
          collector.stop();

          let newDoc = new Market({
            id: message.author.id,
            pokemon: user.pokemons[num],
            price: parseInt(args[2])
          });

          user.pokemons.splice(args[1] - 1, 1);

          await user.save().catch(e => console.log(e));

          await newDoc.save().catch(e => console.log(e));
          msg.reactions.removeAll();
          return message.channel.send(`Successfully listed.`);

        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          msg.reactions.removeAll();
          return message.channel.send("Listing Cancelled!")
        }
      });

      collector.on('end', collected => {
        return;
      });


    } else if (args[0].toLowerCase() === "buy") {
      let market = await Market.find({});
      if (isNaN(args[1])) return message.channel.send(`Failed to convert \`Parametre\` to \`Int\`.`);
      if (!market[parseInt(args[1]) - 1]) return message.channel.send(`You can't buy this Pokémon because it isn't present in the Market Listings!`)

      let num = parseInt(args[1]) - 1;

      let check = await Market.findOne({ id: user.id, pokemon: market[num].pokemon, price: market[num].price });

      if (check) return message.reply(`You can't buy your own Listed Pokémon!`);

      if (market[num].price > user.balance) {
        return message.channel.send(`You don't have enough Credit(s) to buy **Level ${market[num].pokemon.level} ${market[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}**!`)
      }

      let vmsg = `Your **Level ${market[num].pokemon.level} ${market[num].pokemon.name} (${market[num].pokemon.totalIV}% IV)** has been bought by ${message.author.tag} and you have received ${new Intl.NumberFormat('en-IN').format(market[num].price)} Credit(s).`

      let embed = new MessageEmbed()
        .setTitle(`🛒 PokéCool Market`)
        .setDescription(`${message.author}\nAre you sure you want to Market Buy **Level ${market[num].pokemon.level} ${market[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** (${market[num].pokemon.totalIV}% IV) ?\n**Price**: ${market[num].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s)`)
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
          collector.stop();
          msg.reactions.removeAll()
          user.pokemons.push(market[num].pokemon);

          user.balance = user.balance - market[num].price;

          await user.markModified(`pokemons`);

          await user.save().catch(console.error);
          let userd = await User.findOne({ id: market[num].id });

          userd.balance = userd.balance + market[num].price;

          await userd.save().catch(console.error);

          let userD = client.users.cache.get(market[num].id);

          await Market.deleteOne({ id: market[num].id, pokemon: market[num].pokemon, price: market[num].price });


          if (userD) await userD.send(vmsg);
          return message.channel.send(`Successfully Bought.`);


        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          msg.reactions.removeAll();
          return message.channel.send("Cancelled!")
        }
      });

      collector.on('end', collected => {
        return;
      });








    } else if (args[0] === "search" || args[0] === "s") {
      let market = await Market.find({});
      let e = message,
        n = args.slice(1).join(" "),
        a = market,
        i = guild,
        s = a.map((r, num) => { r.pokemon.num = num + 1; return r }),
        zbc = {};
      console.log(n)
      n.split(/--|—/gmi).map(x => {
        if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
      });


      if (zbc["legendary"] || zbc["l"]) s = s.filter(e => { if (legends.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      else if (zbc["mythical"] || zbc["m"]) s = s.filter(e => { if (mythics.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      else if (zbc["ultrabeast"] || zbc["ub"]) s = s.filter(e => { if (ub.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      else if (zbc["mega"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) return e });
      else if (zbc["gmax"] || zbc["gigantamax"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("gigantamax-")) return e });
      else if (zbc["alolan"] || zbc["a"]) s = s.filter(e => { if (alolans.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      else if (zbc["galarian"]) s = s.filter(e => { if (galarians.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e; })
      else if (zbc["shiny"] || zbc["s"]) s = s.filter(e => { if (e.pokemon.shiny) return e });
      else if (zbc["name"] || zbc["n"]) s = s.filter(e => { if (e && (zbc['name'] || zbc['n']) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e });
      else if (zbc['type'] || zbc["tp"]) s = s.filter(e => { if (e.pokemon.rarity.match(new RegExp((zbc['type'] || zbc["tp"]), "gmi")) != null) return e });
      else if (zbc['order'] || zbc['o']) {
        let order = zbc['order'] || zbc['o'];
        if (order == "price a") {
          s = s.sort((a, b) => { return parseFloat(a.price) - parseFloat(b.price) });
        }
        else if (order == "price d") {
          s = s.sort((a, b) => { return parseFloat(b.price) - parseFloat(a.price) });
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
      else if (zbc["hpiv"]) {
        let a = zbc["hpiv"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.hp > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.hp < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.hp == a[1]) return e });
      }
      else if (zbc["atkiv"]) {
        let a = zbc["atkiv"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.atk > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.atk < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.atk == a[1]) return e });
      }
      else if (zbc["defiv"]) {
        let a = zbc["defiv"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.def > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.def < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.def == a[1]) return e });
      }
      else if (zbc["spatkiv"]) {
        let a = zbc["spatkiv"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spatk > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spatk < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spatk == a[1]) return e });
      }
      else if (zbc["spdefiv"]) {
        let a = zbc["spdefiv"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spdef > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spdef < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spdef == a[1]) return e });
      }
      else if (zbc["speediv"]) {
        let a = zbc["speediv"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.speed > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.speed < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.speed == a[1]) return e });
      } //else{
      //   return message.channel.send("This Filter doesn't seem to Exist.")
      // }
      let txt;
      let num = 0
      let embed = new Discord.MessageEmbed()
      let array = [s];
      //console.log(s)
      let chunks = chunk(s, 20)

      let index = 0;
      if (Number(args[1])) index = parseInt(args[1]) - 1
      let ix = ((index % chunks.length) + chunks.length) % chunks.length;
      let actualpage = index + 1
      index = ((index % chunks.length) + chunks.length) % chunks.length;
      if (isNaN(e[1])) txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(item.price)} Credit(s)`).slice(0, 15).join("\n")

      if (Number(args[1])) {
        if (txt == "") {
          txt += "There is Nothing listed on the Markets"
        }
        if (chunks.length == 0) {
          chunks.length = 1
        }
        //console.log(chunks.map(item => {item.pokemon}).join("\n"))
        embed
          .setTitle(`🛒 PokéCool Market`)
          .setColor(color)
          .setDescription((chunks[index].map((item, i) => { return `${item.pokemon.shiny ? ":star: " : ""} **Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(item.price)} Credit(s)` }).join("\n")))
        if (args[1] > chunks.length) {
          embed.setDescription("There is Nothing listed on Markets matching this Search!")
        }
        embed.setFooter(`Showing ${args[1]}-${chunks.length} of ${s.length} pokémon matching this search.`);
        return e.channel.send(embed)
      }
      else {
        if (txt == "") {
          txt += "There is Nothing listed on Markets matching this Search!"
        }
        if (chunks.length == 0) {
          chunks.length = 1
        }
        let embed = new Discord.MessageEmbed()
          .setTitle(`🛒 PokéCool Market`)
          .setColor(color)
          .setDescription(txt)
          .setFooter(`Showing 1-${chunks.length} of ${s.length} pokémon matching this search.`);
        return e.channel.send(embed)
      }
      let all = await Market.find({});
      // let chunks = chunk(all, 20);

      if (Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}m`) || Number(args[0]) && message.content.startsWith(`${guild.prefix}market`)) {
        //    if(args[0] == 0) args[0]; 
        let chunks = chunk(all, 20);
        let index = args[0] - 1;
        //   if(index) index;
        //   console.log(chunks[0]);
        let ix = ((index % chunks.length) + chunks.length) % chunks.length;
        //   const no = ((ix + 1)*20)-20
        embed
        let actualpage = index + 1
        index = ((index % chunks.length) + chunks.length) % chunks.length;
        if (args[0] > chunks.length) {
          embed.setDescription(`There is Nothing listed on the Markets`)
          embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${all.length} pokémon matching this search.`);
        }
        else {
          const no = ((index + 1) * 20) - 20
          embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${no + i + 1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} Credit(s)`).join('\n') || "There is no pokemon in market")
          embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`);
        }
        embed.setAuthor("🛒 PokéCool Market")
        embed.setColor(color)
        return message.channel.send(embed);
      }
      if (all[20] && message.content.endsWith(`${guild.prefix}m`) || message.content.endsWith(`${guild.prefix}market`)) {
        //    if(args[0] == 0) args[0]; 
        let chunks = chunk(all, 20);
        let index = 0;
        //   if(index) index;
        //   console.log(chunks[0]);
        let ix = ((index % chunks.length) + chunks.length) % chunks.length;
        //   const no = ((ix + 1)*20)-20

        let actualpage = index + 1
        index = ((index % chunks.length) + chunks.length) % chunks.length;
        const no = ((index + 1) * 20) - 20

        embed
          .setAuthor("🛒 PokéCool Market")
          .setColor(color)
          .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${i + 1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} Credit(s)`).join('\n') || "There is no pokemon in market")
          .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
        return message.channel.send(embed);

      }
      else {
        embed
          .setAuthor("🛒 PokéCool Market")
          .setColor(color)
          .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${i + 1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} Credit(s)`).join('\n') || "There is no Pokemon listed in the Markets!")
          .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
        return message.channel.send(embed);
      }

    } else {

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


