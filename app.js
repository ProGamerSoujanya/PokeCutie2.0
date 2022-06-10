const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const client = require("./server");
const express = require("express");
const app = express();
const User = require('./models/user.js');
const Guild = require('./models/guild.js');
const config = require("./config");
const Topgg = require("@top-gg/sdk");
const axios = require('axios')
const webhook = new Topgg.Webhook(config.topgg.auth);
const jsonParser = require("body-parser").json();
const color = "BLUE"


app
    .get("/", (request, response) => {
        response.status(200).send("Potty Kha Lo Frands :D");
    })
    .post("/dblwebhook", jsonParser, webhook.listener(vote => {
        (async () => {
            let votes = await axios.get("https://top.gg/api/bots/" + client.user.id + "/votes", { headers: { 'Authorization': config.topgg.token } });

            let user = client.users.cache.get(vote.user);
            let id = user.id
            let userDB = await User.findOne({ id: id });

            const webhookClient = new Discord.WebhookClient(config.webhooks.vote.ID, config.webhooks.vote.Token);

            const embed = new MessageEmbed()
                .setThumbnail(user.displayAvatarURL())
                .setTitle(`${user.tag || "Unknown User#0000"} Thank You For Voting`)
                .setDescription(`Vote us on **[top.gg](https://top.gg/bot/${client.user.id}/vote)** ! You can vote once per 12 hours. Added 1 crate to your inventory.`)
                .setColor(color)

            webhookClient.send(embed);

            if (!user || !userDB) return;
            userDB.upvotes = userDB.upvotes + 1;

            if (userDB.upvotes <= 15) {
                userDB.bronzecrate = userDB.bronzecrate + 1;
                await userDB.save();
            } else if (userDB.upvotes > 15 && userDB.upvotes <= 25) {
                userDB.silvercrate = userDB.silvercrate + 1;
                await userDB.save();
            } else if (userDB.upvotes > 25 && userDB.upvotes <= 90) {
                userDB.goldencrate = user.goldencrate + 1;
                await userDB.save();
            } else if (userDB.upvotes > 150 && userDB.upvotes <= 200) {
                userDB.diamondcrate = user.diamondcrate + 1;
                await userDB.save();
            } else if (userDB.upvotes > 200) {
                userDB.deluxecrate = user.deluxecrate + 1;
                await userDB.save();
            }

            const Dmembed = new MessageEmbed()
            .setTitle(`Thanks for Voting!`)
            .setDescription(`\`\`\`Hey, ${user.tag} You have voted. We are very thankful to you. In return a we are sending you 1 crate in your account.\`\`\`\nYou can vote for the bot again after the duration of 12 hours by clicking [here!](https://top.gg/bot/${client.user.id}/vote)`)
            .setFooter(`Once you have voted, you will get dm from the bot & Rewards will automatically redeemed to your account.`)
            .setColor(color)
            return user.send(Dmembed).catch(e => { return; });
        })();
    }));
const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});