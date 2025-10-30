const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about this server'),
  async execute(interaction) {
    const { guild } = interaction;
    
    const embed = new EmbedBuilder()
      .setColor('#00ffb3')
      .setTitle(`📊 ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
        { name: '📝 Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
        { name: '🔐 Verification', value: guild.verificationLevel.toString(), inline: true },
        { name: '🚀 Boost Level', value: `${guild.premiumTier}`, inline: true },
        { name: '💎 Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
      )
      .setFooter({ text: 'Made by Pixel Beast 🍃' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};