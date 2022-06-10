const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native')
const fs = require("fs");
const { classToPlain } = require("class-transformer");
const { getlength } = require("../../functions");
const Pokemon = require("./../../Classes/Pokemon");
const customisation = require('../../config.js');
const Canvas = require('canvas')
const canvas = Canvas.createCanvas(1192,670);
          const ctx = canvas.getContext('2d')

let Guild = require('../../models/guild.js');
let User = require("../../models/user.js");
let levelUp = require("../../db/levelup.js")
let Spawn = require("../../models/spawn.js");
let pokemon = require("../../db/pokemon.js");
let forms = require("../../db/forms.js");
let primal = require("../../db/primal.js");
let shinyDb = require("../../db/shiny");
let gen8 = require('../../db/gen8.js')
let altmoves = require("../../db/altnames.js");
const { capitalize } = require("../../functions.js");

module.exports = {
  name: "spawnduel",
  description: "spawnduel a Level ${poke.level} pokemon when it appears in the chat.",
  category: "Pokemon",
  args: false,
  usage: ["spawnduel <pokemon>"],
  cooldown: 1,
  permissions: [],
  aliases: ["sd"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
let user = await User.findOne({ id: message.author.id })

    let spawn = await Spawn.findOne({ id: message.channel.id })
    if (!spawn.pokemon[0]) return;
    
    let name = args.join("-").toLowerCase()
    for (var i = 0; i < altmoves.length; i++) {
      let org = []
      altmoves[i].jpname.toLowerCase().split(" | ").forEach(nm => {
        org.push(nm.replace(" ", "-"))
      })
 
      for (let y = 0; y < org.length; y++) {
        if (org[y] == name.toLowerCase()) {
          let og = `${org[0]} | ${org[1]} | ${org[2]}`
          name = name.replace(name, og.toLowerCase().replace("-", " "))
        }
      }
    }
    const altjp = altmoves.find(e => e.jpname.toLowerCase() === name.toLowerCase().replace("shiny-", "")),
      altfr = altmoves.find(e => e.frname.toLowerCase() === name.toLowerCase().replace("shiny-", "")),
      altde = altmoves.find(e => e.dename.toLowerCase() === name.toLowerCase().replace("shiny-", ""));
    if (altjp) name = name.toLowerCase().replace(altjp.jpname.toLowerCase(), altjp.name.toLowerCase());
    else if (altfr) name = name.toLowerCase().replace(altfr.frname.toLowerCase(), altfr.name.toLowerCase());
    else if (altde) name = name.toLowerCase().replace(altde.dename.toLowerCase(), altde.name.toLowerCase());
    5550
    let poke = spawn.pokemon[0];

    if (!poke) return;
    if (poke && name.toLowerCase() == poke.name.toLowerCase().split(/ +/g).join("-")) {
      spawn.pokemon = [];
      spawn.time = 0;
      spawn.hcool = false;
      await spawn.markModified(`pokemons`);
      await spawn.save();
       var selected = user.selected || 0;

        let hp1 = /* totalHPofauthor */ Math.floor(Math.floor((2 * poke.hp + poke.hp + (0 / 4) * poke.level) / 100) + poke.level + 10);
           let hp = /* totalHPofauthor */ Math.floor(Math.floor((2 * user.pokemons[selected].hp + user.pokemons[selected].hp + (0 / 4) * user.pokemons[selected].level) / 100) + user.pokemons[selected].level + 10)
        let hp3 = /* remainingHPofauthor */ hp1;
        let hp2 = hp;
      let lvl = poke.level;
       
      poke.xp = ((lvl - 1) + 80 * lvl + 100);
     await  user.pokemons.push(poke);
let url1 = user.pokemons[selected].url




      user.caught.push(poke);
      user.lbcaught = user.lbcaught + 1;
      user.markModified(`pokemons`);
      user.balance = user.balance + 25
      await user.save();



    if (user.shname !== null && poke.name.toLowerCase() == user.shname.toLowerCase()) ++user.shcount
      await user.save();

    
         const canvas = Canvas.createCanvas(700, 350);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage(`https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d881rst-67b0388f-4616-4464-a57c-5ea720f36b36.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJmYjI4MjFhLTE0MDYtNGExZC05YjA0LTY2NjhmMjc4ZTk0NFwvZDg4MXJzdC02N2IwMzg4Zi00NjE2LTQ0NjQtYTU3Yy01ZWE3MjBmMzZiMzYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.B_VOXbejHTXl83h-cO2q2l_FDRzi4veWzrXANL6bMx4`);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#74037b';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

            
                const poke1 = await Canvas.loadImage(poke.url); // Battleer pokemon image url here 
                ctx.drawImage(poke1, 390, 30, 280, 280);
 
                const poke2 = await Canvas.loadImage(url1); 
                 ctx.drawImage(poke2, 60,15, 280, 280);
            
                     embed = new Discord.MessageEmbed()
                    .setTitle (`You Encountered a Level ${poke.level} ${capitalize(poke.name)}!! `)
                    .setDescription(`**${message.author.username}'s ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()} **\n **HP:** <:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609> \`${hp}/${hp2}\`\n **Level ${poke.level} ${capitalize(poke.name)}**\n **HP:** <:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609> \`${hp1}/${hp3}\``)
                    .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                    .setColor(color)
                    .setImage("attachment://" + "Battle.png")
                    .setFooter("Do p!moves to check your pokemon's moves and do p!use <move_no.> to attack !!")
         let em = await message.channel.send(embed);
     let move1 = ("Thunder Bolt","Hyper Beam","Posion","Psystrike","Self Destruct","Scratch","Twister","Leaf Blade","Absorb","Sludge Bomb")

     let move = ("Thunder Bolt","Hyper Beam","Posion","Psystrike","Self Destruct","Scratch","Twister","Leaf Blade","Absorb")
       
                let PokemonSpeed = Math.floor(Math.floor((2 * user.pokemons[selected].speed + user.pokemons[selected].speed + (0 / 4) * user.pokemons[selected].level) / 100) + user.pokemons[selected].level + 10);
                let pokemonTwoSpeed = Math.floor(Math.floor((2 * poke.speed + poke.speed + (0 / 4) * poke.level) / 100) + poke.level + 10);

                let used = null;
                let used2 = 1;
                let filter = mes => [message.author.username, user.id].includes(mes.author.username) && mes.content.toLowerCase().startsWith(`${prefix.toLowerCase()}use`)
                let Duelcollector = message.channel.createMessageCollector(filter, { time: (3 * 60000) });

                Duelcollector.on("collect", async (mes) => {
                    if (mes.author.username === message.author.username && mes.content.startsWith(`${prefix.toLowerCase()}use`)) {
                        let ar = mes.content.slice(`${prefix.toLowerCase()}use`.length).trim().split(/ +/g);
                        if (!ar[0] || isNaN(ar[0])) return message.channel.send(`Invalid number provided`);

                        if (used !== null) return message.channel.send(`Wait for your opponent to pick a move!`);
                        used = 'done'
                        mes.delete()
                        if (used && used2) RunDuel();
                    }
                    else if (mes.author.username === user.id && mes.content.startsWith(`${prefix.toLowerCase()}use`)) {
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
                    used2 = 1;

                    let damage =  Math.floor(Math.random() * 20) + 5
                    let damage1 =  Math.floor(Math.random() * 20) + 5;
                        hp = hp - damage1;
                    if (PokemonSpeed > pokemonTwoSpeed) {
                        hp1 = hp1 - damage


                         embed69 = new Discord.MessageEmbed()
                            .setTitle (`You Encountered a Level ${poke.level} ${capitalize(poke.name)}!! `)
                            .setDescription(`**${message.author.username}'s ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()} **\n **HP:** <:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609> \`${hp}/${hp2}\`\n **Level ${poke.level} ${capitalize(poke.name)}**\n **HP:** <:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609> \`${hp1}/${hp3}\`\n\n**Level ${user.pokemons[selected].level} ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()} Used ${move1}**\n-${damage}\n**Level ${poke.level} ${capitalize(poke.name)} Used ${move}**\n-${damage1}
                            `)
                            .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                            .setImage("attachment://" + "Battle.png")
                            .setColor(color)
                            .setFooter("Do p!moves to check your pokemon's moves and do p!use <move_no.> to attack !!")

                        message.channel.send(embed69)
                        if (hp < 1) {
                           Duelcollector.stop();
                            
                          embed2 = new Discord.MessageEmbed()
                                .setTitle (`Battle ended!`)
                                .setDescription(`${message.author.username}'s  ${user.pokemons[selected].name.capitalize()} VS Level ${poke.level} ${poke.name.capitalize()}\n\nBattle ended and **Level ${poke.level} ${poke.name} won the Battle !!** In a panic you dropped 10 coins and ran away :dash: !!`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            message.channel.send(embed2)
                                            let idx = parseInt(user.pokemons.length - 1)
                 let name = user.pokemons[idx].name
                     user.pokemons.pop()
      user.balance = user.balance - 10
      await user.save();
      await user.markModified("pokemons")
                        } else if (hp1 < 1) {
                           Duelcollector.stop();
                            
                          embed3 = new Discord.MessageEmbed()
                                .setTitle (`Battle ended!`)
                                .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS Level ${poke.level} ${poke.name.capitalize()}\n\nBattle ended and **${message.author} won the Battle** and was rewarded with 100  :moneybag: Coins and **Level ${poke.level} ${capitalize(poke.name)}**`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            message.channel.send(embed3)
                                 user.balance = user.balance + 100
      await user.save();
                        }
                    } else {
                      let damage = Math.floor(Math.random() * 20) + 5;
                        hp1 = hp1 - damage

                        let damage1 =  Math.floor(Math.random() * 20) + 5;
                        hp = hp - damage1
                        if (hp < 1) hp = 0
                        if (hp1 < 1) hp1 = 0
                        embed691 = new Discord.MessageEmbed()
                            .setDescription(`**${message.author.username}'s ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()} **\n **HP:** <:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609> \`${hp}/${hp2}\`\n **Level ${poke.level} ${capitalize(poke.name)}**\n **HP:** <:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609><:hp:909509263846678609> \`${hp1}/${hp3}\`\n\n**Level ${user.pokemons[selected].level} ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()} Used ${move1}**\n-${damage}\n**Level ${poke.level} ${capitalize(poke.name)} Used ${move}**\n-${damage1}
                           `)
                            .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                            .setImage("attachment://" + "Battle.png")
                            .setColor(color)
                        message.channel.send(embed691)
                        if (hp < 1) {
                           Duelcollector.stop();
                            
                          embed4 = new Discord.MessageEmbed()
                                .setTitle (`Battle ended!`)
                                .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS Level ${poke.level} ${poke.name.capitalize()}\n\nBattle ended and **Level ${poke.level} ${poke.name} won the Battle !!** In a panic you dropped 10 coins and ran away :dash: !!`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return message.channel.send(embed4)
                                            let idx = parseInt(user.pokemons.length - 1)
                 let name = user.pokemons[idx].name
                     user.pokemons.pop()
      user.balance = user.balance - 10
      await user.save();
      await user.markModified("pokemons")
                            //Battle ended and Level ${poke.level} ${poke.name} won the Battle and was rewarded with 10  :moneybag: Coins
                        } else if (hp1 < 1) {
                           Duelcollector.stop();
                            
                          embed5 = new Discord.MessageEmbed()
                                .setTitle (`Battle ended!`)
                                .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS Level ${poke.level} ${poke.name.capitalize()}\n\nBattle ended and **${message.author} won the Battle** and was rewarded with 100  :moneybag: Coins and **Level ${poke.level} ${capitalize(poke.name)}**`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return message.channel.send(embed5)
                                      user.balance = user.balance + 100
      await user.save();
                            //Battle ended and ${message.author} won the Battle and was rewarded with 10  :moneybag: Coins
                        }
                    }

                }
     
    }      
        else {
  
       message.channel.send(':x: That is the wrong Pokemon!')
        }
  }
}