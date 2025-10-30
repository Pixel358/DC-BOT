const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  async execute(interaction, client) {
    try {
      let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
      
      if (!userData) {
        userData = await User.create({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
          balance: 0,
          bank: 0
        });
      }

      const now = new Date();
      if (userData.lastDaily && now - userData.lastDaily < 86400000) {
        const timeLeft = 86400000 - (now - userData.lastDaily);
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        
        return interaction.reply({
          content: `⏰ You already claimed your daily reward! Come back in ${hours}h ${minutes}m`,
          ephemeral: true
        });
      }

      const amount = client.config.economy.dailyAmount;
      userData.balance += amount;
      userData.lastDaily = now;
      await userData.save();

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle('🎁 Daily Reward Claimed!')
        .setDescription(`You received **$${amount.toLocaleString()}**!`)
        .addFields({ name: '💰 New Balance', value: `$${userData.balance.toLocaleString()}` })
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};