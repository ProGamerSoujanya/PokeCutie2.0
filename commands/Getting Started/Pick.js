const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { randomNumber } = require("../../functions.js");
const { capitalize } = require("../../functions.js");
const { config } = require("../../config.js")
const { classToPlain } = require('class-transformer');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const gen8 = require("../../db/gen8.js");
var pokemon = require("../../db/pokemon.js");
const pokemons = require("../../db/pokemons.js");
const ms = require("ms");
const Pokemon = require("../../Classes/Pokemon");
const userSchema = require("./../../models/user");
let starters = [
    "bulbasaur", "フシギダネ", "Fushigidane", "Bisasam", "Bulbizarre", 
    "charmander", "ヒトカゲ", "Hitokage", "Glumanda", "Salamèche",
    "squirtle", "ゼニガメ", "Zenigame", "Schiggy", "Carapuce",

    "chikorita", "チコリータ", "Chikorīta", "Chicorita", "Endivie", "Germignon",
    "cyndaquil", "ヒノアラシ", "Hinoarashi", "Feurigel", "Héricendre",
    "totodile", "ワニノコ", "Waninoko", "Karnimani", "Kaiminus",

    "treecko", "キモリ", "Kimori", "Geckarbor", "Arcko",
    "torchic", "アチャモ", "Achamo", "Flemmli", "Poussifeu",
    "mudkip", "ミズゴロウ", "Mizugorō", "Mizugorou", "Hydropi", "Gobou",

    "turtwig", "ナエトル", "Naetoru", "Naetle", "Chelast", "Tortipouss",
    "chimchar", "ヒコザル", "Hikozaru", "Panflam", "Ouisticram",
    "piplup", "ポッチャマ", "Potchama", "Pochama", "Plinfa", "",

    "snivy", "ツタージャ", "Tsutāja", "Tsutarja", "Serpifeu", "Vipélierre",
    "tepig", "ポカブ", "Pokabu", "Floink", "Gruikui",
    "oshawott", "ミジュマル", "Mijumaru", "Ottaro", "Moustillon",

    "chespin", "ハリマロン", "Harimaron", "Igamaro", "Marisson",
    "fennekin", "フォッコ", "Fokko", "Fynx", "Feunnec",
    "froakie", "ケロマツ", "Keromatsu", "Froxy", "Grenousse",

    "rowlet", "モクロー", "Mokurō", "Mokuroh", "Bauz", "Brindibou",
    "litten", "ニャビー", "Nyabī", "Nyabby", "Flamiau", "Flamiaou",
    "popplio", "アシマリ", "Ashimari", "Robball", "Otaquin",

    "grookey", "サルノリ", "Sarunori", "Chimpep", "Ouistempo",
    "scorbunny", "ヒバニー", "Hibanī", "Hopplo", "Flambino",
    "sobble", "メッソン", "Messon", "Memmeon", "Larméléon",
];
let gen8Starters = [
"grookey", "サルノリ", "Sarunori", "Chimpep", "Ouistempo",
"scorbunny", "ヒバニー", "Hibanī", "Hopplo", "Flambino",
"sobble", "メッソン", "Messon", "Memmeon", "Larméléon",];

module.exports = {
  name: "pick",
  description: "Pick your starter pokémon!",
  category: "GettingStarted",
  args: true,
  usage: ["pick <pokemon>"],
  cooldown: 3,
  aliases: [],
  async execute(client, message, args, prefix, guild, color, channel) {
    try {
        let user = await User.findOne({ id: message.author.id });
        const result = await userSchema.findOne({ id: message.author.id });
        if (result) return message.channel.send(`> ${client.config.no} **You already picked your starter**`);
  
        if (!args[0]) return message.channel.send(`> ${client.config.no} **You didn't specify a starter name.**`);
  
        if (!starters.includes(args[0].toLowerCase())) return message.channel.send(`> ${client.config.no} **That is not a starter pokemon**`);
  
        let find = gen8.find(r => r.name === args.join("-").toLowerCase());
        if (gen8Starters.includes(args.join("-").toLowerCase())) {
          let url,
            shiny,
            re;
          if (randomNumber(0, 100) < 1) {
            shiny = true
            url = find.url
          } else if (randomNumber(0, 100) > 1) {
            shiny = false
            url = find.url
          }
          const type = find.type
          let poke = new Pokemon({ name: find.name, shiny: shiny, rarity: type, url: url });
          poke = await classToPlain(poke)
          await new User({ id: message.author.id }).save()
          user = await User.findOne({ id: message.author.id })
          user.pokemons.push(poke)
          user.selected = 0
          await user.markModified(`pokemons`)
          await user.save()
          return message.channel.send(`> **${client.config.yes} Congratulations..!! ${message.author} ${capitalize(user.pokemons[0].name)} is your starter Pokémon. Type \`${prefix}info\` to get it's stats!**`)
        } else {
          const t = await get({
            url: `https://pokeapi.co/api/v2/pokemon/${args.join("-").toLowerCase()}`,
            json: true
          })
          let url,
            shiny,
            re;
          let check = t.id.toString().length
  
          if (randomNumber(0, 100) < 1) shiny = true;
          if (randomNumber(0, 100) > 1) shiny = false;
          if (!shiny) {
            if (check === 1) {
              url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
            } else if (check === 2) {
              url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
            } else if (check === 3) {
              url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
            }
          } else {
            let get = shinyDb.find(r => r.name === args.join(" "));
            if (get) url = get.url;
            if (!get) url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${args.join("-").toLowerCase()}.gif`;
          }
          const type = t.types.map(r => {
            if (r !== r) re = r;
            if (re == r) return;
            return `${capitalize(r.type.name)}`
  
          }).join(" | ")
          let poke = new Pokemon({ name: (args[0]), shiny: shiny, rarity: type, url: url })
          poke = await classToPlain(poke)
          await new User({ id: message.author.id }).save()
          user = await User.findOne({ id: message.author.id })
          user.pokemons.push(poke)
          user.selected = 0
          await user.markModified(`pokemons`)
          await user.save()
          return message.channel.send(`> **${client.config.yes} Congratulations..!! ${message.author} ${capitalize(user.pokemons[0].name)} is your starter Pokémon. Type \`${prefix}info latest\` to get it's stats!**`)
        }
      }
      catch (error) {
        return message.channel.send(`> **There Was an error trying to Execute Pick Command.**` + "\n" + error)
      }
    }
  }