const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");
const Form = require("../../db/forms.js")


module.exports = {
  name: "shop",
  description: "Display the shop menu!",
  category: "Pokemon Commands",
  args: false,
  usage: ["shop [page]"],
  cooldown: 3,
  permissions: [],
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    let user1 = await User.findOne({ id: message.author.id })
    let user = await User.findOne({ id: message.author.id })
    if (!user1 || !user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!")

    let embed = new MessageEmbed()
      .setColor(color)
      .setTitle(`🛒 ・  PokeCutie SHOP`)
      .setDescription(`See a specific page of shop by using the \`${prefix}shop <page>\` command.`)
      .addField("Level | 1", `\`XP Boosters & Rare Candies\``)
      .addField("Evolution | 2", `\`Rare Stones & Evolution Items\``)
      .addField("Natures | 3", `\`Nature Modifiers\``)
      .addField("Items | 4", `\`Held Items\``)
      .addField("Pokémon Forms | 5", `\`Forms & Transformations\``)
      .addField("Gigantamax | 6", `\`Gigantamax Transformations\``)
      .addField("Shards | 7", `\`Shards Exchange\``)

    let embed1 = new MessageEmbed()
      .setColor(color)
      .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 1 - XP Boosters & Rare Candies`)
      .setDescription(`Get XP boosters to increase your XP gain from chatting and battling!`)
      .addField("30 Minutes - 2X Multiplier | Cost:  20 Credits", `\`p!buy 1 30m\``)
      .addField("1 Hour - 2X Multiplier | Cost:  40 Credits", `\`p!buy 1 1h\``)
      .addField("2 Hours - 2X Multiplier | Cost:  70 Credits", `\`p!buy 1 2h\``)
      .addField("3 Hours - 2X Multiplier | Cost:  90 Credits", `\`p!buy 1 3h\``)
      .addField("Rare Candy | Cost:  75 Credits/Each", `Rare candies level up your selected pokémon by one level for each candy you feed it.\n\`p! 1 candy [amount]\``)

    let embed2 = new MessageEmbed()
      .setColor(color)
      .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 2 - Rare Stones & Evolution Items`)
      .setDescription("Some pokémon don't evolve through leveling and need an evolution stone or high friendship to evolve. Here you can find all the evolution stones as well as a friendship bracelet for friendship evolutions.\n\n**All these items cost 150 credits.**")
      .addField("Dawn Stone", `\`p! stone dawn\``, true)
      .addField("Dusk Stone", `\`p! stone dusk\``, true)
      .addField("Fire Stone", `\`p! stone fire\``, true)
      .addField("Ice Stone", `\`p! stone ice\``, true)
      .addField("Leaf Stone", `\`p! stone leaf\``, true)
      .addField("Moon Stone", `\`p! stone moon\``, true)
      .addField("Shiny Stone", `\`p! stone shiny\``, true)
      .addField("Sun Stone", `\`p! stone sun\``, true)
      .addField("Thunder Stone", `\`p! stone thunder\``, true)
      .addField("Water Stone", `\`p! stone water\``, true)
      .addField("Friendship Bracelet", `\`p! stone friendship bracelet\``, true)

    let embed3 = new MessageEmbed()
      .setColor(color)
      .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 3 - Nature Mints`)
      .setDescription(`Nature modifiers change your selected pokémon's nature to a nature of your choice for credits. Use \`p! 3 nature <name>\` to buy the nature you want!\n\n**All nature modifiers cost 50 credits**.`)
      .addField("Adamant Mint", '\`+10% Attack\n-10% Sp. Atk\`', true)
      .addField("Bashful Mint", '\`No Effect\`', true)
      .addField("Bold Mint", '\`+10% Defense\n-10% Attack\`', true)
      .addField("Brave Mint", '\`+10% Attack\n-10% Speed\`', true)
      .addField("Calm Mint", '\`+10% Sp. Def\n-10% Attack\`', true)
      .addField("Careful Mint", '\`+10% Sp. Def\n-10% Sp. Atk\`', true)
      .addField("Docile Mint", '\`No effect\`', true)
      .addField("Gentle Mint", '\`+10% Sp. Def\n-10% Defense\`', true)
      .addField("Hardy Mint", '\`No effect\`', true)
      .addField("Hasty Mint", '\`+10% Speed\n-10% Defense\`', true)
      .addField("Impish Mint", '\`+10% Defense\n-10% Sp. Atk\`', true)
      .addField("Jolly Mint", '\`+10% Speed\n-10% Sp. Atk\`', true)
      .addField("Lax Mint", '\`+10% Defense\n-10% Sp. Def\`', true)
      .addField("Lonely Mint", '\`+10% Attack\n-10% Defense\`', true)
      .addField("Mild Mint", '\`+10% Sp. Attack\n-10% Defense\`', true)
      .addField("Modest Mint", '\`+10% Sp. Attack\n-10% Sp. Atk\`', true)
      .addField("Naive Mint", '\`+10% Speed\n-10% Sp. Def\`', true)
      .addField("Naughty Mint", '\`+10% Attack\n-10% Sp. Def\`', true)
      .addField("Quiet Mint", '\`+10% Attack\n-10% Speed\`', true)
      .addField("Quirky Mint", '\`No Effect\`', true)
      .addField("Rash Mint", '\`+10% Sp. Attack\n-10% Sp. Def\`', true)
      .addField("Relaxed Mint", '\`+10% Defense\n-10% Speed\`', true)
      .addField("Sassy Mint", '\`+10% Sp. Def\n-10% Speed\`', true)
      .addField("Serious Mint", '\`No Effect\`', true)
      .addField("Timid Mint", '\`+10% Speed\n-10% Attack\`', true)

    let embed4 = new MessageEmbed()
      .setColor(color)
      .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 4 - Held Items`)
      .setDescription(`Buy items for your pokémon to hold using \`p! 4 item <name>\`\n\n**All these items cost 75 credits**`)
      // .addField("King's Rock", '\`Held item for your Pokémon.\`', true)
      // .addField("Deep Sea Tooth", '\`Held item for your Pokemon\`', true)
      // .addField("Deep Sea Scale", '\`Held item for your Pokemon\`', true)
      // .addField("Metal Coat", '\`Held item for your Pokemon\`', true)
      // .addField("Dragon Scale", '\`Held item for your Pokemon\`', true)
      // .addField("Upgrade", '\`Held item for your Pokemon\`', true)
      // .addField("Protector", '\`Held item for your Pokemon\`', true)
      // .addField("Electirizer", '\`Held item for your Pokemon\`', true)
      // .addField("Magmarizer", '\`Held item for your Pokemon\`', true)
      // .addField("Dubious Disc", '\`Held item for your Pokemon\`', true)
      // .addField("Reaper Cloth", '\`Held item for your Pokemon\`', true)
      // .addField("Whipped Dream", '\`Held item for your Pokemon\`', true)
      // .addField("Sachet", '\`Held item for your Pokemon\`', true)
      .addField("Everstone", '\`Prevents pokémon from evolving.\`', true)
      .addField("XP Blocker", '\`Prevents pokémon from gaining XP.\`', true)
      // .addField("Prism Scale", '\`Held item for your Pokemon\`', true)

    let embed8 = new MessageEmbed()
    .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 6 - Gigantamax Transformation`)
      .setDescription("Some pokémon have different gigantamax evolutions, you can buy them here to allow them to transform.")
      .addField("Eternatus", `\`p! gmax eternatus\``, true)
      .addField("Venusaur", `\`p! gmax venusaur\``, true)
      .addField("Charizard", `\`p! gmax charizard\``, true)
      .addField("Blastoise", `\`p! gmax blastoise\``, true)
      .addField("Butterfree", `\`p! gmax butterfree\``, true)
      .addField("Pikachu", `\`p! gmax pikachu\``, true)
      .addField("Meowth", `\`p! gmax meowth\``, true)
      .addField("Machamp", `\`p! gmax machamp\``, true)
      .addField("Gengar", `\`p! gmax gengar\``, true)
      .addField("Kingler", `\`p! gmax kingler\``, true)
      .addField("Lapras", `\`p! gmax lapras\``, true)
      .addField("Eevee", `\`p! gmax eevee\``, true)
      .addField("Snorlax", `\`p! gmax snorlax\``, true)
      .addField("Garbodor", `\`p! gmax garbodor\``, true)
      .addField("Melmetal", `\`p! gmax melmetal\``, true)
      .addField("Rillaboom", `\`p! gmax rillaboom\``, true)
      .addField("Cinderace", `\`p! gmax cinderace\``, true)
      .addField("Inteleon", `\`p! gmax inteleon\``, true)
      .addField("Corviknight", `\`p! gmax corviknight\``, true)
      .addField("Orbeetle", `\`p! gmax orbeetle\``, true)
      .addField("Drednaw", `\`p! gmax drednaw\``, true)
      .addField("Coalossal", `\`p! gmax coalossal\``, true)
      .addField("Flapple", `\`p! gmax flapple\``, true)
      .addField("Sandaconda", `\`p! gmax sandaconda\``, true)
      .addField("Toxtricity", `\`p! gmax toxtricity\``, true)
      .addField("Centiskorch", `\`p! gmax centiskorch\``, true)
      .addField("Hatterene", `\`p! gmax hatterene\``, true)
      .addField("Grimmsnarl", `\`p! gmax grimmsnarl\``, true)
      .addField("Alcremie", `\`p! gmax alcremie\``, true)
      .addField("Copperajah", `\`p! gmax copperajah\``, true)
      .addField("Duraludon", `\`p! gmax duraludon\``, true)
      .addField("Urshifu", `\`p! gmax urshifu\``, true)
      .setColor(color)

    let embed9 = new MessageEmbed()
      .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 7 - Shards Exchange`)
      .setDescription("We have a variety of items that you can purchase using Shards.")
      .addField("Redeem - 200 Shards/Each", `Get any Spawnable Pokémon of your choice.\n\`p! 7 redeem [amount]\``)
      .addField("Incense - 1000 Shards/180n", `Increase Spawn Rate by 33.3% for 180 Spawns.\n\`p! 7 incense\``)
      .addField("Pokémons - 100 Shards/10n", `Get 10 rare Pokémons with random stats.\n\`p! 7 pokemon\``)
      .setColor(color)
      .setFooter("Shards are premium currency and can be obtained by Donating IRL Money.")
      .setThumbnail(client.user.displayAvatarURL())


    if (!args[0]) return message.channel.send(embed)
    else if (args[0] === "1") return message.channel.send(embed1)
    else if (args[0] === "2") return message.channel.send(embed2)
    else if (args[0] === "3") return message.channel.send(embed3)
    else if (args[0] === "4") return message.channel.send(embed4)
    else if (args[0] == "5") {
      if (!args[1]) {
        console.log(2)
        let embed5 = new Discord.MessageEmbed()
          .setColor(color)
          .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nPage 5 - Pokémon Forms`)
          .addField("__Subpages in Shop 5__", `**1**.) Mega Transformations\n**2**.) Normal Pokémon Forms \`(1/2)\`\n**3**.) Normal Pokémon Forms \`(2/2)\`\n**4**.) Mythical Pokémon Forms\n**5**.) Legendary Pokémon Forms`)
          .setFooter("Gigantamax Forms on Shop 6.")
          .setThumbnail(client.user.displayAvatarURL())

        message.channel.send(embed5).then((msgx) => {
          msgx.react("🏘️");
          const filter = (reaction, user) => {
            return (
              reaction.emoji.name === "🏘️" &&
              user.id === message.author.id
            );
            let embed = new Discord.MessageEmbed();
          };

          const collector = msgx.createReactionCollector(filter, { time: 120000 });

          collector.on("collect", (reaction, user) => {
            reaction.users.remove(user.id);
            msgx.edit(embed5);
          })

          collector.on('end', collected => {
            msgx.reactions.removeAll().catch(r => { return });
          })

          let emoji = "1️⃣"
          msgx.react(emoji);
          let r1F = (reaction, user) => reaction.emoji.name === "1️⃣" && user.id === message.author.id;
          let r1 = msgx.createReactionCollector(r1F, { timer: 6000 });

          r1.on("collect", (reaction, user) => {
            reaction.users.remove(user.id);
            let embed = new Discord.MessageEmbed()
              .setColor(color)
              .setAuthor(`Balance: ${user1.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user1.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user1.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nPage 5 - Pokémon Forms - Mega Transformations`)
              .setDescription("**All Mega Transformations costs 1000 Credits.**")
              .addField("#1) Regular Mega Transformation", `Transforms your pokémon into its mega form.\n\`p! 5 mega\``)
              .addField("#2) Mega X Transformation", `Transforms your pokémon into its Mega X form.\n\`p! 5 mega x\``)
              .addField("#3) Mega Y Transformation", `Transforms your pokémon into its Mega Y form.\n\`p! 5 mega y\``)
              .setThumbnail(client.user.displayAvatarURL())

            msgx.edit(embed);
          });
          let emoji2 = "2️⃣"
          msgx.react(emoji2);
          let r2F = (reaction, user) => reaction.emoji.name === "2️⃣" && user.id === message.author.id;
          let r2 = msgx.createReactionCollector(r2F, { timer: 6000 });

          r2.on("collect", (reaction, user) => {
            reaction.users.remove(user.id);
            let embed = new Discord.MessageEmbed()
              .setAuthor(`Balance: ${user1.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user1.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user1.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nPage 5 (1/2) - Pokémon Forms - Normal Transformations`)
              .setDescription("Some pokémon have different forms, you can buy them here to allow them to transform.")
              .addField("Castform", `\`${prefix}shopbuy 5 forms castform\``, true)
              .addField("Wormadam", `\`${prefix}shopbuy 5 forms wormadam\``, true)
              .addField("Basculin", `\`${prefix}shopbuy 5 forms basculin\``, true)
              .addField("Greninja", `\`${prefix}shopbuy 5 forms greninja\``, true)
              .addField("Aegislash", `\`${prefix}shopbuy 5 forms aegislash\``, true)
              .addField("Oricorio", `\`${prefix}shopbuy 5 forms oricorio\``, true)
              .addField("Lycanroc", `\`${prefix}shopbuy 5 forms lycanroc\``, true)
              .addField("Rotom", `\`${prefix}shopbuy 5 forms rotom\``, true)
              .addField("Cherrim", `\`${prefix}shopbuy 5 forms cherrim\``, true)
              .addField("Wishiwashi", `\`${prefix}shopbuy 5 forms wishiwashi\``, true)
              .addField("Pichu", `\`${prefix}shopbuy 5 forms pichu\``, true)
              .addField("Deerling", `\`${prefix}shopbuy 5 forms deerling\``, true)
              .addField("Sawsbuck", `\`${prefix}shopbuy 5 forms sawsbuck\``, true)
              .addField("Floette", `\`${prefix}shopbuy 5 forms floette\``, true)
              .addField("Flabébé", `\`${prefix}shopbuy 5 forms flabébé\``, true)
              .addField("Florges", `\`${prefix}shopbuy 5 forms florges\``, true)
              .addField("Furfrou", `\`${prefix}shopbuy 5 forms furfrou\``, true)
              .addField("Minior", `\`${prefix}shopbuy 5 forms minior\``, true)
              .addField("Cramorant", `\`${prefix}shopbuy 5 forms cramorant\``, true)
              .addField("Eiscue", `\`${prefix}shopbuy 5 forms eiscue\``, true)
              .addField("Morpeko", `\`${prefix}shopbuy 5 forms morpeko\``, true)
              .setThumbnail(client.user.displayAvatarURL())
              .setColor(color)

            msgx.edit(embed);
          });
          let emoji3 = "3️⃣"
          msgx.react(emoji3);
          let r3F = (reaction, user) => reaction.emoji.name === "3️⃣" && user.id === message.author.id;
          let r3 = msgx.createReactionCollector(r3F, { timer: 6000 });

          r3.on("collect", (reaction, user) => {
            reaction.users.remove(user.id);

            let embed = new Discord.MessageEmbed()
              .setAuthor(`Balance: ${user1.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user1.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user1.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nPage 5 (2/2) - Pokémon Forms - Normal Transformations`)
              .setDescription("Some pokémon have different forms, you can buy them here to allow them to transform.")
              .addField("Castform", `\`${prefix}shopbuy 5 forms castform\``, true)
              .addField("Wormadam", `\`${prefix}shopbuy 5 forms wormadam\``, true)
              .addField("Basculin", `\`${prefix}shopbuy 5 forms basculin\``, true)
              .addField("Greninja", `\`${prefix}shopbuy 5 forms greninja\``, true)
              .addField("Aegislash", `\`${prefix}shopbuy 5 forms aegislash\``, true)
              .addField("Oricorio", `\`${prefix}shopbuy 5 forms oricorio\``, true)
              .addField("Lycanroc", `\`${prefix}shopbuy 5 forms lycanroc\``, true)
              .addField("Rotom", `\`${prefix}shopbuy 5 forms rotom\``, true)
              .addField("Cherrim", `\`${prefix}shopbuy 5 forms cherrim\``, true)
              .addField("Wishiwashi", `\`${prefix}shopbuy 5 forms wishiwashi\``, true)
              .addField("Pichu", `\`${prefix}shopbuy 5 forms pichu\``, true)
              .addField("Deerling", `\`${prefix}shopbuy 5 forms deerling\``, true)
              .addField("Sawsbuck", `\`${prefix}shopbuy 5 forms sawsbuck\``, true)
              .addField("Floette", `\`${prefix}shopbuy 5 forms floette\``, true)
              .addField("Flabébé", `\`${prefix}shopbuy 5 forms flabébé\``, true)
              .addField("Florges", `\`${prefix}shopbuy 5 forms florges\``, true)
              .addField("Furfrou", `\`${prefix}shopbuy 5 forms furfrou\``, true)
              .addField("Minior", `\`${prefix}shopbuy 5 forms minior\``, true)
              .addField("Cramorant", `\`${prefix}shopbuy 5 forms cramorant\``, true)
              .addField("Eiscue", `\`${prefix}shopbuy 5 forms eiscue\``, true)
              .addField("Morpeko", `\`${prefix}shopbuy 5 forms morpeko\``, true)
              .setThumbnail(client.user.displayAvatarURL())
              .setColor(color)

            msgx.edit(embed);
          });


          let emoji4 = "4️⃣"
          msgx.react(emoji4);
          let r4F = (reaction, user) => reaction.emoji.name === "4️⃣" && user.id === message.author.id;
          let r4 = msgx.createReactionCollector(r4F, { timer: 6000 });

          r4.on("collect", (reaction, user) => {
            reaction.users.remove(user.id);

            let embed = new Discord.MessageEmbed()
              .setAuthor(`Balance: ${user1.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user1.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user1.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nPage 5 - Pokémon Forms - Mythical Transformations`)
              .addField("Hoopa", `\`${prefix}shopbuy 5 forms hoopa\``, true)
              .addField("Deoxys", `\`${prefix}shopbuy 5 forms deoxys\``, true)
              .addField("Meloetta", `\`${prefix}shopbuy 5 forms meloetta\``, true)
              .addField("Shaymin", `\`${prefix}shopbuy 5 forms shaymin\``, true)
              .addField("Keldeo", `\`${prefix}shopbuy 5 forms keldeo\``, true)

              .setColor(color)

            msgx.edit(embed);
          });
          let emoji5 = "5️⃣"
          msgx.react(emoji5);
          let r5F = (reaction, user) => reaction.emoji.name === "5️⃣" && user.id === message.author.id;
          let r5 = msgx.createReactionCollector(r5F, { timer: 6000 });

          r5.on("collect", (reaction, user) => {
            reaction.users.remove(user.id);

            let embed = new Discord.MessageEmbed()
              .setAuthor(`Balance: ${user1.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user1.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user1.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nPage 5 - Pokémon Forms - Legendary Transformations`)
              .setDescription("Some pokémon have different forms, you can buy them here to allow them to transform.")
              .addField("Kyogre", `\`${prefix}shopbuy 5 forms kyogre\``, true)
              .addField("Groudon", `\`${prefix}shopbuy 5 forms groudon\``, true)

              .addField("Giratina", `\`${prefix}shopbuy 5 forms giratina\``, true)
              .addField("Tornadus", `\`${prefix}shopbuy 5 forms tornadus\``, true)
              .addField("Thundurus", `\`${prefix}shopbuy 5 forms thundurus\``, true)
              .addField("Landorus", `\`${prefix}shopbuy 5 forms landorus\``, true)
              .addField("Kyurem", `\`${prefix}shopbuy 5 forms kyurem\``, true)

              .addField("Zygarde", `\`${prefix}shopbuy 5 forms zygarde\``, true)

              .addField("Necrozma", `\`${prefix}shopbuy 5 forms necrozma\``, true)
              .addField("Zacian", `\`${prefix}shopbuy 5 forms zacian\``, true)
              .addField("Zamazenta", `\`${prefix}shopbuy 5 forms zamazenta\``, true)
              .addField("Calyrex", `\`${prefix}shopbuy 5 forms calyrex\``, true)
              .addField("Mewtwo", `\`${prefix}shopbuy 5 forms mewtwo\``, true)
              .addField("Xerneas", `\`${prefix}shopbuy 5 forms xerneas\``, true)
              .addField("Marshadow", `\`${prefix}shopbuy 5 forms marshadow\``, true)
              .addField("Solgaleo", `\`${prefix}shopbuy 5 forms solgaleo\``, true)
              .addField("Lunala", `\`${prefix}shopbuy 5 forms Lunala\``, true)
              .setColor(color)


            msgx.edit(embed);
          });
          let emoji6 = "⏹"
          msgx.react(emoji6);
          let r6F = (reaction, user) => reaction.emoji.name === "⏹" && user.id === message.author.id;
          let r6 = msgx.createReactionCollector(r6F, { timer: 6000 });

          r6.on("collect", (reaction, user) => {
            reaction.users.remove(user.id);
            collector.stop()
            msgx.reactions.removeAll()
          });
        })
      } else if (args[1] && (args[1].toLowerCase() == "forms") || (args[1].toLowerCase() == "form")) {
        if (!args[2]) return message.channel.send("Failed to recevie `Parametre` = `Name`" + "\n" + `${prefix}shopbuy 5 forms <pokémon>\``)
        let name = args.slice(2).join("-")
        // console.log(name)
        let form = Form.filter(r => r.name.endsWith(name))
        if (form.length === 0) return message.channel.send("That Pokémon doesn't have any `Form` transformations!")
        // console.log(form)

        let embed = new Discord.MessageEmbed()
          .setAuthor(`Balance: ${user1.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Credit(s) | Shards: ${user1.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Redeems: ${user1.redeems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
          .setDescription(`Some pokémon have different forms, you can buy them here to allow them to transform.\n\n**All ${name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} form costs 1000 Credits.**\n\`${prefix}shopbuy 5 form <name>\``)
          .addField(`${name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Forms`, "-> " + form.map(e => e.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())).join("\n-> "))
          .setColor(color)

        return message.channel.send(embed)


      } else {
        return
      }
    }
    else if (args[0] === "6") return message.channel.send(embed8)
    else if (args[0] === "7") return message.channel.send(embed9)
    else return message.channel.send(`Shop Number \`${args[0]}\` not found.`)
  }
}