const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for money'),
  cooldown: 30,
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

      if (Math.random() < 0.3) {
        return interaction.reply({
          content: '😔 Nobody gave you any money...',
          ephemeral: true
        });
      }

      const min = client.config.economy.begMin;
      const max = client.config.economy.begMax;
      const amount = Math.floor(Math.random() * (max - min + 1)) + min;

      userData.balance += amount;
      await userData.save();

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle('🙏 Someone Helped You!')
        .setDescription(`A kind stranger gave you **$${amount.toLocaleString()}**!`)
        .addFields({ name: '💰 New Balance', value: `$${userData.balance.toLocaleString()}` })
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};