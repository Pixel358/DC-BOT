const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket system commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Setup ticket system')
        .addChannelOption(option =>
          option.setName('category')
            .setDescription('Category for tickets')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Close current ticket')),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === 'setup') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({ content: '❌ You need Administrator permission!', ephemeral: true });
        }

        const category = interaction.options.getChannel('category');

        let guildData = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildData) {
          guildData = await Guild.create({ guildId: interaction.guild.id });
        }

        guildData.ticketCategory = category.id;
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Ticket System Setup')
          .setDescription(`Ticket category set to ${category}`)
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'close') {
        if (!interaction.channel.name.startsWith('ticket-')) {
          return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('🎫 Ticket Closed')
          .setDescription(`Ticket closed by ${interaction.user}`)
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
        
        setTimeout(() => {
          interaction.channel.delete();
        }, 5000);

        await interaction.reply({ content: '✅ Closing ticket in 5 seconds...', ephemeral: true });
      }
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};