const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8ball a question')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Your question')
        .setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    
    const responses = [
      'Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not',
      'Ask again later', 'Cannot predict now', 'Very doubtful',
      'Most likely', 'Without a doubt', 'Yes definitely',
      'You may rely on it', 'As I see it yes', 'Outlook good',
      'Signs point to yes', 'Reply hazy try again', 'Better not tell you now',
      'Concentrate and ask again', 'Don\'t count on it', 'My reply is no',
      'My sources say no', 'Outlook not so good'
    ];

    const answer = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor('#00ffb3')
      .setTitle('🎱 Magic 8Ball')
      .addFields(
        { name: '❓ Question', value: question },
        { name: '🔮 Answer', value: answer }
      )
      .setFooter({ text: 'Made by Pixel Beast 🍃' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};