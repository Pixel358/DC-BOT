const { Events } = require('discord.js');
const User = require('../database/models/User');
const Guild = require('../database/models/Guild');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;

    try {
      const guildData = await Guild.findOne({ guildId: message.guild.id });
      
      if (guildData && guildData.leveling.enabled) {
        const xpToAdd = Math.floor(Math.random() * 15) + 10;
        const userData = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        
        if (userData) {
          userData.xp += xpToAdd;
          const requiredXp = userData.level * 100;
          
          if (userData.xp >= requiredXp) {
            userData.level += 1;
            userData.xp = 0;
            
            if (guildData.leveling.levelUpMessage) {
              message.channel.send(`🎉 ${message.author}, you leveled up to level **${userData.level}**!`);
            }
          }
          await userData.save();
        } else {
          await User.create({
            userId: message.author.id,
            guildId: message.guild.id,
            xp: xpToAdd,
            level: 1
          });
        }
      }

      if (guildData && guildData.autoResponders) {
        for (const ar of guildData.autoResponders) {
          if (message.content.toLowerCase().includes(ar.trigger.toLowerCase())) {
            message.channel.send(ar.response);
            break;
          }
        }
      }

      if (guildData && guildData.automod.enabled) {
        if (guildData.automod.antiSpam) {
          const userMessages = message.channel.messages.cache.filter(
            m => m.author.id === message.author.id && Date.now() - m.createdTimestamp < 5000
          );
          if (userMessages.size > 5) {
            await message.delete();
            message.channel.send(`⚠️ ${message.author}, please stop spamming!`).then(msg => {
              setTimeout(() => msg.delete(), 3000);
            });
          }
        }

        if (guildData.automod.antiInvite && !message.member.permissions.has('Administrator')) {
          const inviteRegex = /(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)/gi;
          if (inviteRegex.test(message.content)) {
            await message.delete();
            message.channel.send(`⚠️ ${message.author}, invite links are not allowed!`).then(msg => {
              setTimeout(() => msg.delete(), 3000);
            });
          }
        }

        if (guildData.automod.badWords && guildData.automod.badWords.length > 0) {
          const hasBadWord = guildData.automod.badWords.some(word => 
            message.content.toLowerCase().includes(word.toLowerCase())
          );
          if (hasBadWord) {
            await message.delete();
            message.channel.send(`⚠️ ${message.author}, please watch your language!`).then(msg => {
              setTimeout(() => msg.delete(), 3000);
            });
          }
        }
      }

      if (guildData && guildData.afkUsers) {
        const afkUser = guildData.afkUsers.find(u => u.userId === message.author.id);
        if (afkUser) {
          guildData.afkUsers = guildData.afkUsers.filter(u => u.userId !== message.author.id);
          await guildData.save();
          message.reply(`👋 Welcome back! Your AFK status has been removed.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
          });
        }

        message.mentions.users.forEach(user => {
          const mentionedAfk = guildData.afkUsers.find(u => u.userId === user.id);
          if (mentionedAfk) {
            message.reply(`💤 ${user.tag} is currently AFK: ${mentionedAfk.reason}`);
          }
        });
      }

    } catch (error) {
      console.error('Error in messageCreate event:', error);
    }
  }
};