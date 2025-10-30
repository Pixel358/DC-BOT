const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor('#00ffb3')
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
        { name: 'API Latency', value: `${client.ws.ping}ms`, inline: true }
      )
      .setFooter({ text: 'Made by Pixel Beast 🍃' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};