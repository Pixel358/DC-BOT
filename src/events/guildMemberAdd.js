const { Events, EmbedBuilder } = require('discord.js');
const Guild = require('../database/models/Guild');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    try {
      const guildData = await Guild.findOne({ guildId: member.guild.id });
      
      if (guildData && guildData.welcomeChannel) {
        const channel = member.guild.channels.cache.get(guildData.welcomeChannel);
        if (channel) {
          const embed = new EmbedBuilder()
            .setColor('#00ffb3')
            .setTitle('🥝 Welcome to the Server!')
            .setDescription(guildData.welcomeMessage || `Welcome ${member.user}, enjoy your stay!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: '👤 Member', value: `${member.user.tag}`, inline: true },
              { name: '📊 Member Count', value: `${member.guild.memberCount}`, inline: true }
            )
            .setFooter({ text: 'Made by Pixel Beast 🍃' })
            .setTimestamp();

          channel.send({ embeds: [embed] });
        }
      }

      if (guildData && guildData.autoRole) {
        const role = member.guild.roles.cache.get(guildData.autoRole);
        if (role) {
          await member.roles.add(role);
        }
      }
    } catch (error) {
      console.error('Error in guildMemberAdd event:', error);
    }
  }
};