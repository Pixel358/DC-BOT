const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for being AFK')
        .setRequired(false)),
  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'AFK';

    try {
      let guildData = await Guild.findOne({ guildId: interaction.guild.id });
      
      if (!guildData) {
        guildData = await Guild.create({ guildId: interaction.guild.id });
      }

      if (!guildData.afkUsers) {
        guildData.afkUsers = [];
      }

      guildData.afkUsers.push({
        userId: interaction.user.id,
        reason: reason,
        timestamp: new Date()
      });

      await guildData.save();

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle('💤 AFK Status Set')
        .setDescription(`Your AFK status has been set: **${reason}**`)
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};