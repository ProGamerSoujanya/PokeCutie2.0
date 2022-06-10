const Discord = require('discord.js')
const { get } = require('request-promise-native')
const { classToPlain } = require('class-transformer')
const User = require('../../models/user.js')

const { capitalize, getlength } = require("../../functions.js");
const Canvas = require('canvas')
 const canvas = Canvas.createCanvas(1192,670);
          const ctx = canvas.getContext('2d')

module.exports = {
  name: "hatch",
  description: "open a crate",
  category: "Pokemon",
  args: true,
  usage: ["hatch"],
  cooldown: 3,
  permissions: [],
    aliases: ["e"],
 
  execute: async (client, message, args, prefix, guild, color, channel) => {

     let user = await User.findOne({id: message.author.id})
  if(args[0].toLowerCase() === "egg") {

       if(user.egg === 0) return message.channel.send(`You dont have enough Eggs!`)

       let pokes = ["rockruff","riolu","pichu","happiny","togepi","gible","smoochum","buneary","magby"]


      let poke = pokes[Math.floor(Math.random() * pokes.length)]
      
      let options = {
      url: `https://pokeapi.co/api/v2/pokemon/${poke}`, 
      json: true 
    }


    let t; 
    let type; 
    
      await get(options).then(async t1 => {
      
        t = t1; //ezzz
        let re;
        type = t.types.map(r => {
          if (r !== r) re = r ;
          if (re == r) return;
          return `${r.type.name}`
        }).join(" | ")

        let check = t1.id.toString().length

    let url;
    if (check === 1) {
      url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t1.id}.png`
    } else if (check === 2) {
      url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t1.id}.png`
    } else if (check === 3) {
      url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t1.id}.png`
    }

          var shiny = false
    //type = galarian
    gen = Math.floor(Math.random() * 750);
    if (gen <= 10) shiny = true;
  
    let lvl = Math.floor(Math.random() *4)+ 1;

    let hp = Math.floor(Math.random() * 31);
    atk = Math.floor(Math.random() * 31);
    def = Math.floor(Math.random() * 31);
    spatk = Math.floor(Math.random() * 31);
    spdef = Math.floor(Math.random() * 31);
      speed = Math.floor(Math.random() * 31);

      let xp = Math.floor(1.2 * lvl ^ 3 ) - (15 * lvl ^ 2) + (100 * lvl) - 140 + 52

       let totaliv =(((hp + atk + def + spatk + spdef + speed))/186)*100
let iv = totaliv.toFixed(2);
      
       user.pokemons.push({
      level: lvl,
      xp: 0,
      name: poke,
      hp: hp,
      atk: atk,
      def: def,
      spatk: spatk,
      spdef: spdef,
      speed: speed,
      moves: [],
      shiny: shiny,
      rarity: type,
      nature: 'Hasty',
      url: url,
      totalIV: iv

    })
    await user.markModified(`pokemons`)
    user.egg = user.egg - 1
    await user.save();
   let imgname = 'new.png'
    
        
      let bg = "https://cdn.discordapp.com/attachments/891557291436949504/952053128637845584/abstract-colorful-geometric-overlapping-background-and-texture-free-vector.jpg";
       ;
         
          const background = await Canvas.loadImage(bg)
          ctx.drawImage(background,0,0,1192,670)
          const pk = await Canvas.loadImage(url)
          ctx.drawImage(pk,300,100,550,550)
 
            let embedx1 = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`Congratulations ${message.author.username} your Egg Hatched  !! `)
            .setDescription(` A ${capitalize(poke)}  hatched from the egg. Type \`p!info latest\` to view it !!`)
            .attachFiles([{ name: "new.png", attachment: canvas.toBuffer() }])
            .setImage("attachment://" + "new.png")
            .setFooter(`The pokemon has been added to your inventory.`)
  return message.channel.send(embedx1)
  })
     }
  }
}

