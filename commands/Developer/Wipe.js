const Discord = require("discord.js");
const mongoose = require("mongoose");
const User = require("./../../models/user");
module.exports = {
  name: "wipe",
  category: "developer",
  description: "wipe a server or a user",
  usage: "wipe server <serverid> || wipe user <userid>",
  execute: async(client, message, args, prefix) => {
    let user = message.mentions.members.first() || client.users.cache.get(args[0])
    if(!user) return message.channel.send(`Please type userid or mention user to use. Correct Usage: **${prefix}wipe userid.**`)
      User.findOneAndDelete({id: user.id}, (err, res) => {
      if(err) message.channel.send(err)
        message.channel.send("Done")  
      })
  }
}
