const Discord = require("discord.js");
const Canvas = require("canvas");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { randomNumber } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const Concept = require('../../db/concept.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const cooldown = new Set();
const ms = require("ms");
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = {
    name: "battle",
    description: "Battle another user.",
    category: "Pokemon Commands",
    args: true,
    usage: ["duel <@user>"],
    cooldown: 3,
    permissions: [],
    aliases: ["duel"],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        //message.channel.send("Duel is under construction. If you still like to proceed , Continue.")
        let embed = new MessageEmbed()
            .setColor(color);
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix.toLowerCase() + "start\` command before using this command!");
        let user1 = message.mentions.members.first();
        if (user1.id === message.author.id) return message.channel.send(` Usage : ${prefix.toLowerCase()}battle <@user>\nSee (${prefix.toLowerCase()}help) ${module.exports.name} for more information on Battle.`);

        let user2 = await User.findOne({ id: user1.id });
        if (!user2 || !user2.pokemons[0]) return message.channel.send(user1.user.username + " need to pick a starter pokémon using the \`" + prefix.toLowerCase() + "start\` command before using this command!");
;
        //if (!user.selected || !user2.selected) return message.channel.send(`Either you or your opponent has not selected any pokemon to Battle!`)

        var selected = user.selected || 0;
        var selected1 = user2.selected || 0;
        var name = user.pokemons[selected].name.toLowerCase();
        if (name.startsWith("alolan")) {
            name = name.replace("alolan", "").trim().toLowerCase();
            name = `${name}-alola`.toLowerCase();
        }
        var name1 = user2.pokemons[selected1].name;
        if (name1.toLowerCase().startsWith("alolan")) {
            name1 = name1.replace("alolan", "").trim().toLowerCase();
            name1 = `${name1}-alola`.toLowerCase();
        }
        //Battleer checker
        const cp = Concept.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
        const g = Galarians.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase().replace("galarian-", ""))
        const pk = Pokemon.find(e => e.name === user.pokemons[selected].name.toLowerCase())
        const g8 = Gen8.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
        const s = Shiny.find(e => e.name === user.pokemons[selected].name.toLowerCase())
        const f = Forms.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())

        //Accepter checker
        const cp1 = Concept.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase())
        const g1 = Galarians.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase().replace("galarian-", ""))
        const pk1 = Pokemon.find(e => e.name === user2.pokemons[selected1].name.toLowerCase())
        const g81 = Gen8.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase())
        const s1 = Shiny.find(e => e.name === user2.pokemons[selected1].name.toLowerCase())
        const f1 = Forms.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase())

        var url = user.pokemons[selected].url
        var url1 = user2.pokemons[selected1].url
        let msg = await message.channel.send(`${message.member.displayName} has challenged you to a Battle! Type \`${prefix.toLowerCase()}accept\` or \`${prefix.toLowerCase()}deny\` to respond.`);
        const collector = new MessageCollector(msg.channel, m => m.author.id === user2.id, { time: 30000 });
        collector.on('collect', async m => {
            if (m.content.toLowerCase() === prefix.toLowerCase() + "accept") {
                cooldown.add(message.author.id);
                cooldown.add(user1.id);

              const canvas = Canvas.createCanvas(700, 350);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage(`https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d881rst-67b0388f-4616-4464-a57c-5ea720f36b36.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJmYjI4MjFhLTE0MDYtNGExZC05YjA0LTY2NjhmMjc4ZTk0NFwvZDg4MXJzdC02N2IwMzg4Zi00NjE2LTQ0NjQtYTU3Yy01ZWE3MjBmMzZiMzYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.B_VOXbejHTXl83h-cO2q2l_FDRzi4veWzrXANL6bMx4`);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#74037b';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                const poke1 = await Canvas.loadImage(url); // Battleer pokemon image url here 
                ctx.drawImage(poke1, 390, 15, 270, 270);
           
                const poke2 = await Canvas.loadImage(url1); 
                 ctx.drawImage(poke2, 20, 15, 270, 270);
              

                let hp = /* totalHPofauthor */ Math.floor(Math.floor((2 * user.pokemons[selected].hp + user.pokemons[selected].hp + (0 / 4) * user.pokemons[selected].level) / 100) + user.pokemons[selected].level + 10);
                let hp1 = /* totalHPofaccepter */ Math.floor(Math.floor((2 * user2.pokemons[selected1].hp + user2.pokemons[selected1].hp + (0 / 4) * user2.pokemons[selected1].level) / 100) + user2.pokemons[selected1].level + 10)
                let hp2 = /* remainingHPofauthor */ hp;
                let hp3 = /* totalHPofaccepter */ hp1;
                embed
                    .setTitle (`Battle of a Life Time`)
                    .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()}: ${hp}/${hp2}HP\n${user1.user.username}'s ${user2.pokemons[selected1].name.replace(/-+/g, " ").capitalize()}: ${hp1}/${hp3}HP`)
                    .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                    .setImage("attachment://" + "Battle.png")
                    .setFooter("Do p!moves to check your pokemon's moves and do p!use <move_no.> to attack !!")
                let em = await message.channel.send(embed);

                let PokemonSpeed = Math.floor(Math.floor((2 * user.pokemons[selected].speed + user.pokemons[selected].speed + (0 / 4) * user.pokemons[selected].level) / 100) + user.pokemons[selected].level + 10);
                let pokemonTwoSpeed = Math.floor(Math.floor((2 * user2.pokemons[selected1].speed + user2.pokemons[selected1].speed + (0 / 4) * user2.pokemons[selected1].level) / 100) + user2.pokemons[selected1].level + 10);

                let used = null;
                let used2 = null;
                let filter = mes => [message.author.id, user1.id].includes(mes.author.id) && mes.content.toLowerCase().startsWith(`${prefix.toLowerCase()}use`)
                let Duelcollector = message.channel.createMessageCollector(filter, { time: (3 * 60000) });

                Duelcollector.on("collect", async (mes) => {
                    if (mes.author.id === message.author.id && mes.content.startsWith(`${prefix.toLowerCase()}use`)) {
                        let ar = mes.content.slice(`${prefix.toLowerCase()}use`.length).trim().split(/ +/g);
                        if (!ar[0] || isNaN(ar[0])) return message.channel.send(`Invalid number provided`);

                        if (used !== null) return message.channel.send(`Wait for your opponent to pick a move!`);
                        used = 'done'
                        mes.delete()
                        if (used && used2) RunDuel();
                    }
                    else if (mes.author.id === user1.id && mes.content.startsWith(`${prefix.toLowerCase()}use`)) {
                        let ar = mes.content.slice(`${prefix.toLowerCase()}use`.length).trim().split(/ +/g);
                        if (!ar[0] || isNaN(ar[0])) return message.channel.send(`Invalid number provided`);

                        if (used2 !== null) return message.channel.send(`Wait for your opponent to pick a move!`);
                        used2 = 'done';
                        mes.delete()
                        if (used && used2) RunDuel();
                    }
                });

                async function RunDuel() {
                    used = null;
                    used2 = null;

                    let damage =  Math.floor(Math.random() * 20) + 5
                    let damage1 =  Math.floor(Math.random() * 20) + 5;
                        hp = hp - damage1;
                    if (PokemonSpeed > pokemonTwoSpeed) {
                        hp1 = hp1 - damage


                        embed
                            .setTitle (`Battle of a Life Time`)
                            .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()}: ${hp}/${hp2}HP\n${user1.user.username}'s ${user2.pokemons[selected1].name.replace(/-+/g, " ").capitalize()}: ${hp1}/${hp3}HP`)
                            .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                            .setImage("attachment://" + "Battle.png")
                            .setColor(color)
                            .setFooter("Do p!moves to check your pokemon's moves and do p!use <move_no.> to attack !!")

                        em.edit(embed)
                        if (hp < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setTitle (`Battle ended!`)
                                .setDescription(`<@${message.author.id}>'s ${user.pokemons[selected].name.capitalize()} VS <@${user1.id}>'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${user1} won the Battle and was rewarded with 10  :money_bag: Coins`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                        } else if (hp1 < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setTitle (`Battle ended!`)
                                .setDescription(`<@${message.author.id}>'s ${user.pokemons[selected].name.capitalize()} VS <@${user1.id}>'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${message.author} won the Battle and was rewarded with 10  :money_bag: Coins`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                        }
                    } else {
                      let damage = Math.floor(Math.random() * 20) + 5;
                        hp1 = hp1 - damage

                        let damage1 =  Math.floor(Math.random() * 20) + 5;
                        hp = hp - damage1
                        if (hp < 1) hp = 0
                        if (hp1 < 1) hp1 = 0
                        embed
                            .setDescription(`<@${message.author.id}>'s ${user.pokemons[selected].name.capitalize()} VS <@${user1.id}>'s ${user2.pokemons[selected1].name.capitalize()}\n\n${user1} has used move and dealt ${damage} Damage.\n${message.author} has used move and dealt ${damage1} Damage.\n\n${user.pokemons[selected].name}: ${hp}\n${user2.pokemons[selected1].name}: ${hp1}`)
                            .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                            .setImage("attachment://" + "Battle.png")
                            .setColor(color)
                        em.edit(embed)
                        if (hp < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setTitle (`Battle ended!`)
                                .setDescription(`<@${message.author.id}>'s ${user.pokemons[selected].name.capitalize()} VS <@${user1.id}>'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${user1} won the Battle and was rewarded with 10  :money_bag: Coins`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                            //Battle ended and ${user1} won the Battle and was rewarded with 10  :money_bag: Coins
                        } else if (hp1 < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setTitle (`Battle ended!`)
                                .setDescription(`<@${message.author.id}>'s ${user.pokemons[selected].name.capitalize()} VS <@${user1.id}>'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${message.author} won the Battle and was rewarded with 10  :money_bag: Coins`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                            //Battle ended and ${message.author} won the Battle and was rewarded with 10  :money_bag: Coins
                        }
                    }

                }

            } else if (m.content === prefix.toLowerCase() + "deny") {
                message.channel.send("Cancelled the Battle")
                collector.stop('deny')
            } else {

            }
        })
        collector.on('end', (r, reason) => {
            if (['reason', 'deny'].includes(reason)) {
                message.channel.send(`Battle request expired`)
                cooldown.delete(message.author.id);
                cooldown.delete(user.id)
            }
        });
    }
}