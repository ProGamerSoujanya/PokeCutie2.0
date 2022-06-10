const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize, getlength } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const shinydb = require('../../db/shiny.js');
const megashinydb = require('../../db/mega-shiny.js');
const Forms = require('../../db/forms.js');
const Concept = require('../../db/concept.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const Gmax = require('../../db/gmax.js')
const ms = require("ms");
const Canvas = require('canvas')
const config = require('../../config.js')

module.exports = {
  name: "select",
  description: "//",
  category: "Pokemon Commands",
  args: false,
  usage: ["select [pokemonID]"],
  cooldown: 3,
  aliases: ["s"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    let userx = await User.findOne({ id: message.author.id })
    if (!userx) return message.channel.send(`> ${config.no} **You need to pick a starter pokémon using the \`start\` command before using this command!**`);

    let x 
    if (args[0].toLowerCase() == "latest" || args[0].toLowerCase() == "l" || args[0].toLowerCase() == "0"){
      x = userx.pokemons.length - 1
    } else {
      x = parseInt(args[0] - 1)
    }
    if ( x > userx.pokemons.length - 1) return message.channel.send(`> ${config.no} **You don\'t have pokémon on that number!**`)
    
    userx.selected = x 
    await userx.save()
    return message.channel.send(`> ${config.yes}  **You selected your \`Level ${userx.pokemons[x].level} ${userx.pokemons[x].shiny == true ? "⭐ " : ""}${userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`**`)
  }
}