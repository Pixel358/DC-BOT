const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your or another user\'s balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check balance')
        .setRequired(false)),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    try {
      let userData = await User.findOne({ userId: targetUser.id, guildId: interaction.guild.id });
      
      if (!userData) {
        userData = await User.create({
          userId: targetUser.id,
          guildId: interaction.guild.id,
          balance: 0,
          bank: 0
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle(`💰 ${targetUser.username}'s Balance`)
        .addFields(
          { name: '💵 Wallet', value: `$${userData.balance.toLocaleString()}`, inline: true },
          { name: '🏦 Bank', value: `$${userData.bank.toLocaleString()}`, inline: true },
          { name: '💎 Total', value: `$${(userData.balance + userData.bank).toLocaleString()}`, inline: true }
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};