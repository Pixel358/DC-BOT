const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),
  cooldown: 5,
  async execute(interaction) {
    try {
      const response = await axios.get('https://meme-api.com/gimme');
      const meme = response.data;

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle(meme.title)
        .setImage(meme.url)
        .setURL(meme.postLink)
        .addFields({ name: '👍 Upvotes', value: `${meme.ups}`, inline: true })
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Failed to fetch meme!', ephemeral: true });
    }
  }
};