const { Client, MessageEmbed, Message, Collection } = require("discord.js");
const fs = require("fs");
const ascii = require("ascii-table");

module.exports = class PokeCool extends Client {
  constructor(options) {
    super({
      fetchAllMembers: true,
    });
    this.table = new ascii("Commands");
    this.table2 = new ascii("Events");
    this.commands = new Collection();
    this.config = require("../config");
    this.prefix = this.config.prefix;
    this.color = 0xb6ffdb;
    this.cooldowns = new Collection();
  }

  /**
   *
   * @param {String} text Any String
   * @returns String.
   */
  clean(text) {
    (async () => {
      if (text && text.constructor.name == "Promise") text = await text;
      if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });

      text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(
          this.config.token,
          "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0"
        );

      //return text;
    })();
    return text;
  }

  /**
   * Parse ms and returns a string
   * @param {number} milliseconds The amount of milliseconds
   * @returns The parsed milliseconds
   */

  ms(milliseconds) {
    let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    let days = roundTowardsZero(milliseconds / 86400000),
      hours = roundTowardsZero(milliseconds / 3600000) % 24,
      minutes = roundTowardsZero(milliseconds / 60000) % 60,
      seconds = roundTowardsZero(milliseconds / 1000) % 60;
      
    if (seconds === 0) {
      seconds = (milliseconds)/1000;
    }
    let isDays = days > 0,
      isHours = hours > 0,
      isMinutes = minutes > 0;
    let pattern =
      (!isDays
        ? ""
        : isMinutes || isHours
        ? "{days} days, "
        : "{days} days and ") +
      (!isHours ? "" : isMinutes ? "{hours} hours, " : "{hours} hours and ") +
      (!isMinutes ? "" : "{minutes} minutes and ") +
      "{seconds} seconds";
    let sentence = pattern
      .replace("{duration}", pattern)
      .replace("{days}", days)
      .replace("{hours}", hours)
      .replace("{minutes}", minutes)
      .replace("{seconds}", seconds);
    return sentence;
  }
};
