const axios = require('axios');
const express = require("express");
const app = express();
const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../models/user.js');
const Guild = require('../models/guild.js');
const Spawn = require('../models/spawn.js');
const Auction = require("../models/auctions.js");
const ms = require("ms");
const mongoose = require("mongoose");


module.exports = async client => {
  mongoose.connect(`mongodb://${client.config.mongo_atlas.username}:${client.config.mongo_atlas.password}@${client.config.mongo_atlas.shard.one},${client.config.mongo_atlas.shard.two},${client.config.mongo_atlas.shard.three}/${client.config.mongo_atlas.cluster}?ssl=true&replicaSet=${client.config.mongo_atlas.cluster}-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true, useUnifiedTopology: true }).then(async mon => {
        await console.log(`Connected to the database!`);
    }).catch((err) => {
        console.log("Unable to connect to the Mongodb Database. Error:" + err, "error")
    });
    await console.log(client.table.toString() + "\n" + client.table2.toString());
    console.log(`${client.user.tag} Has Successfully Connected To Discord API!`
        + `\n-----------------------------------------\n`
        + `> Users: ${client.users.cache.size}\n`
        + `> Channels: ${client.channels.cache.size}\n`
        + `> Servers: ${client.guilds.cache.size}`
    );


  let i = 0;
	let activities = ["PokeCutie | p!help for more info"]
	setInterval(async () => {
		client.user.setActivity(`${activities[Math.floor(i++ % activities.length)]}`, { type: "LISTENING" })
	}, 30000);


 //Website
	require("../app");
}