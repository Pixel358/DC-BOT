const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug someone')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to hug')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    const embed = new EmbedBuilder()
      .setColor('#00ffb3')
      .setDescription(`🤗 ${interaction.user} hugs ${user}!`)
      .setFooter({ text: 'Made by Pixel Beast 🍃' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};