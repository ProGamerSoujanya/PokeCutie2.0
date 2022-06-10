const User = require("./../../models/user");
var pokemon = require("./../../db/pokemon.js");
const Discord = require("discord.js")
const hastebin = require("hastebin-gen");
const Guild = require('../../models/guild.js')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const ind = 0;
const fs = require("fs");
const legends = fs.readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = fs.readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = fs.readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const ub = fs.readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
var forms = require("./../../db/forms.js");
var mega = require("./../../db/mega.js");
var shadow = require("./../../db/shadow.js");
var megashiny = require("./../../db/mega-shiny.js");
var primal = require("./../../db/primal.js");
var shiny = require('./../../db/shiny.js')

module.exports = {
    name: `favorites`,
    category: 'Information',
    description: 'Check your favorites',
    usage: 'favorites',
    aliases: ["fav", "f"],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        let nguild = await Guild.findOne({ id: message.guild.id });
        const user = await User.findOne({id: message.author.id});

        if(!user) return message.channel.send (`> ❌ **You must pick your starter pokémon with \`${nguild.prefix}start\` before using this command.**`);

      user.pokemons.map((r, i) => {
r.num = i;
return r
});
      
        let filter = user.pokemons.filter(r => r.fav === true);
    if(filter.length === 0) {
      return message.channel.send(`> ❌ **You don't have any favourite pokemon(s). Use \`${nguild.prefix}addfav\` to add a favourite pokemon.**`);
    }
    if(Number(args[0]) && user.pokemons[20].fav && message.content.startsWith(`${nguild.prefix}f`) || Number(args[0]) && message.content.startsWith(`${nguild.prefix}fav`)){
//    if(args[0] == 0) args[0]; 
    let chunks = chunk(filter, 20);
    let index = args[0]-1;
 //   if(index) index;
 //   console.log(chunks[0]);
    let ix = (( index % chunks.length) + chunks.length) % chunks.length;
 //   const no = ((ix + 1)*20)-20
    const embed = new Discord.MessageEmbed();
    let actualpage = index + 1
    index = ((index % chunks.length) + chunks.length) % chunks.length;
    if(args[0] > chunks.length){
      embed.setDescription(`Nothing to show`)
      embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${filter.length} pokémon matching this search.`);
    }
    else{
      const no = ((index + 1)*20)-20
      embed.setDescription(chunks[index].map((item, i) => `\`${item.num+1}\` **${item.name} ${(item.shiny ? "⭐": "")}**　•　Level: ${item.level}　•　IV: ${item.totalIV}%${(item.nick != null ? `　•　Nickname: ${item.nick}`: "")}`).join('\n'))
      embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${filter.length} pokémon matching this search.`);
    }
    embed.setTitle(`${message.author.tag}'s favourites:`)
    embed.setColor(color)
    return message.channel.send(embed); 
  }
  if(user.pokemons[20] && message.content.endsWith(`${nguild.prefix}f`) || message.content.endsWith(`${nguild.prefix}fav`) || message.content.endsWith(`${nguild.prefix}favourites`)){
//    if(args[0] == 0) args[0]; 
    let chunks = chunk(filter, 20);
    let index = 0;
 //   if(index) index;
 //   console.log(chunks[0]);
    let ix = (( index % chunks.length) + chunks.length) % chunks.length;
 //   const no = ((ix + 1)*20)-20
    const embed = new Discord.MessageEmbed();
    let actualpage = index + 1
    index = ((index % chunks.length) + chunks.length) % chunks.length;
    const no = ((index + 1)*20)-20
    embed.setTitle(`${message.author.tag}'s favourites:`)
    embed.setDescription(chunks[index].map((item, i) => `\`${item.num+1}\` **${item.name} ${(item.shiny ? "⭐": "")}**　•　Level: ${item.level}　•　IV: ${item.totalIV}%${(item.nick != null ? `　•　Nickname: ${item.nick}`: "")}`).join('\n'))
    embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${filter.length} pokémon matching this search.`);
    embed.setColor(client.config.color)
    return message.channel.send(embed); 
  }
    
   else {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(`${message.author.tag}'s favourites:`)
    embed.setDescription(user.pokemons.map((item, i) => `**${item.name} ${(item.shiny ? "⭐": "")}**  ・  Level: ${item.level}  ・  Number: ${item.num+1}  ・  IV: ${item.totalIV}%${(item.nick != null ? `  ・  Nickname: ${item.nick}`: "")}`).join('\n'))
    embed.setFooter(`Showing 1-1 of ${filter.length} pokémon matching this search.`);
    embed.setColor(color)
    return message.channel.send(embed);
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
