const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Poll question')
        .setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');

    const embed = new EmbedBuilder()
      .setColor('#00ffb3')
      .setTitle('📊 Poll')
      .setDescription(question)
      .addFields({ name: 'Vote Below', value: '👍 Yes | 👎 No' })
      .setFooter({ text: 'Made by Pixel Beast 🍃' })
      .setTimestamp();

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    await message.react('👍');
    await message.react('👎');
  }
};