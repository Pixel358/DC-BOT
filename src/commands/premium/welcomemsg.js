const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcomemsg')
    .setDescription('Setup welcome messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set welcome channel and message')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Welcome channel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
        .addStringOption(option =>
          option.setName('message')
            .setDescription('Welcome message (use {user} for mention, {server} for server name)')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable welcome messages')),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      let guildData = await Guild.findOne({ guildId: interaction.guild.id });
      
      if (!guildData) {
        guildData = await Guild.create({ guildId: interaction.guild.id });
      }

      if (subcommand === 'set') {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        guildData.welcomeChannel = channel.id;
        guildData.welcomeMessage = message;
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Welcome Messages Configured')
          .addFields(
            { name: 'Channel', value: `${channel}` },
            { name: 'Message', value: message }
          )
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'disable') {
        guildData.welcomeChannel = null;
        guildData.welcomeMessage = null;
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Welcome Messages Disabled')
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};