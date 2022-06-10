const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");
const db = require("mongoose");

module.exports = {
    name: "leaderboard",
    description: "leaderboard",
    category: "information",
    usage: ["lb <type>"],
    cooldown: 3,
    aliases: ["lb"],

    execute: async (client, message, args, prefix, guild, color, channel) => {
       
       let user = await User.findOne({id: message.author.id});   
       let userx = await User.findOne({ id: message.author.id });
       if(!user) return message.channel.send (`> <:x_mark:868344397211787275> **You must pick your starter pokémon with \`${prefix}start\` before using this command.**`);

let embed = new MessageEmbed()
.setAuthor(`Pokecool Leaderboard`)
.addField("credits Leaderboard",`\`${prefix}leaderboard credits\``)
.addField("Shards Leaderboard",`\`${prefix}leaderboard shards\``)
.addField("Redeems Leaderboard",`\`${prefix}leaderboard redeems\``)
.addField("Pokemons Caught Leaderboard",`\`${prefix}leaderboard caught\``)
.addField("Pokemons Released Leaderboard",`\`${prefix}leaderboard released\``)
.setColor(color)
if (!args[0]) return message.channel.send(embed);

else if (args[0].toLowerCase() ==="credits"){
   await User.find({
        
    }).sort([
        ['balance', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Credits Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';

                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **Unknown User#0000**  \n> ${res[i].balance} credits \n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**  \n> ${res[i].balance} credits \n`);
                }
            }
           leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';
                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **Unknown User#0000**  \n> ${res[i].balance} credits \n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**  \n> ${res[i].balance} credits \n`);
                }
            }
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
    else   if (args[0].toLowerCase() ==="caught"){
  
         await User.find({
        
    }).sort([
        ['lbcaught', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Pokemons Caught Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';

                if (user === "Unknown Usert"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**  \n> ${res[i].lbcaught++} Caught\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**  \n> ${res[i].lbcaught++} Caught\n`);
                }
            }
           leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';
                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**  \n> ${res[i].lbcaught++} Caught\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**  \n> ${res[i].lbcaught++} Caught\n`);
                }
            }
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
else if (args[0].toLowerCase() ==="redeems" || args[0].toLowerCase() ==="redeem"){
   await User.find({
        
    }).sort([
        ['redeems', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Redeems's Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';

                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].redeems} Redeems\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].redeems} Redeems\n`);
                }
            }
           leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';
                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].redeems} Redeems\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].redeems} Redeems\n`);
                }
            }
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
else if (args[0].toLowerCase() ==="shards"){
   await User.find({
        
    }).sort([
        ['shards', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Shards Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';
                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].shards} Shards\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].shards} Shards\n`);
                }
            }
           leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'Unknown User';
                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].shards} Shards\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].shards} Shards\n`);
                }
            }
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
    else  if (args[0].toLowerCase() ==="released"){
   await User.find({
        
    }).sort([
        ['released', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Pokemons Released Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                 let user =  client.users.cache.get(res[i].id)|| 'Unknown User';
                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].released} Released\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].released} Released\n`);
                }
            }
           leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                 let user =  client.users.cache.get(res[i].id)|| 'Unknown User';
                if (user === "Unknown User"){
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].released} Released\n`);
                }else{
                    leaderboard.push(`> **${i + 1}**   ・   **${user.tag}**   \n> ${res[i].released} Released\n`);
                }
            }
            leaderboardEmbed.setColor(color);
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
else return message.channel.send(embed);
    }
}