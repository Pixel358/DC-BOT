const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Setup auto role for new members')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set auto role')
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Role to give new members')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable auto role')),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      let guildData = await Guild.findOne({ guildId: interaction.guild.id });
      
      if (!guildData) {
        guildData = await Guild.create({ guildId: interaction.guild.id });
      }

      if (subcommand === 'set') {
        const role = interaction.options.getRole('role');

        guildData.autoRole = role.id;
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Auto Role Set')
          .setDescription(`New members will receive ${role}`)
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'disable') {
        guildData.autoRole = null;
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Auto Role Disabled')
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};