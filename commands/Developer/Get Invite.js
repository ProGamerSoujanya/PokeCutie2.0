const ownerid = ["785849562161741854", "835771316303822898", "598458511944450049", "766553763569336340", "838388562029183006", "814353938429771776"];


module.exports = {
  name: "getinvite",
  aliases: ['getinv', 'gi'],
  category: "developer",
  description: "Generates an invitation to  server in question.",
  usage: "[ID | name]",

  execute: async (client, message, args, prefix, guild, color, channel) => {
    if (ownerid.includes(message.author.id)) {
      let guild = null;

      if (!args[0]) return message.channel.send("Enter Guild Name or Guild ID of where you want Invite Link.")

      if (args[0]) {
        let fetched = client.guilds.cache.find(g => g.name === args.join(" "));
        let found = client.guilds.cache.get(args[0]);
        if (!found) {
          if (fetched) {
            guild = fetched;
          }
        } else {
          guild = found
        }
      } else {
        return message.channel.send("That's the Invalid Guild Name");
      }
      if (guild) {
        let tChannel = guild.channels.cache.find(ch => ch.type == "text" && ch.permissionsFor(ch.guild.me).has("CREATE_INSTANT_INVITE"));
        if (!tChannel) {
          return message.channel.send("Sorry, I don't have CREATE_INSTANT_INVITE Permission There!");
        }
        let invite = await tChannel.createInvite({ temporary: false, maxAge: 0 }).catch(err => {
          return message.channel.send(`${err} has occured!`);
        });
        return message.channel.send(invite.url);
      } else {
        return message.channel.send(`\`${args.join(' ')}\` - I'm not in that Server.`);
      }
    } else {
      return;
    }
  }

}