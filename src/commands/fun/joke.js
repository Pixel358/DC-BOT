const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),
  cooldown: 5,
  async execute(interaction) {
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const joke = response.data;

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle('😂 Random Joke')
        .addFields(
          { name: '📝 Setup', value: joke.setup },
          { name: '🎭 Punchline', value: joke.punchline }
        )
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Failed to fetch joke!', ephemeral: true });
    }
  }
};