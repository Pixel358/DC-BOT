const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn money'),
  cooldown: 60,
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

      const jobs = [
        'Developer', 'Designer', 'Teacher', 'Doctor', 'Engineer', 
        'Artist', 'Musician', 'Chef', 'Writer', 'Photographer'
      ];
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const min = client.config.economy.workMin;
      const max = client.config.economy.workMax;
      const amount = Math.floor(Math.random() * (max - min + 1)) + min;

      userData.balance += amount;
      await userData.save();

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle('💼 Work Complete!')
        .setDescription(`You worked as a **${job}** and earned **$${amount.toLocaleString()}**!`)
        .addFields({ name: '💰 New Balance', value: `$${userData.balance.toLocaleString()}` })
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};