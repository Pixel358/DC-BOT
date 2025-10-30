const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Manage auto responders')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add an auto responder')
        .addStringOption(option =>
          option.setName('trigger')
            .setDescription('Trigger word/phrase')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('response')
            .setDescription('Response message')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove an auto responder')
        .addStringOption(option =>
          option.setName('trigger')
            .setDescription('Trigger to remove')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all auto responders')),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      let guildData = await Guild.findOne({ guildId: interaction.guild.id });
      
      if (!guildData) {
        guildData = await Guild.create({ guildId: interaction.guild.id });
      }

      if (!guildData.autoResponders) {
        guildData.autoResponders = [];
      }

      if (subcommand === 'add') {
        const trigger = interaction.options.getString('trigger');
        const response = interaction.options.getString('response');

        guildData.autoResponders.push({ trigger, response });
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Auto Responder Added')
          .addFields(
            { name: 'Trigger', value: trigger },
            { name: 'Response', value: response }
          )
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'remove') {
        const trigger = interaction.options.getString('trigger');
        
        guildData.autoResponders = guildData.autoResponders.filter(ar => ar.trigger !== trigger);
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Auto Responder Removed')
          .setDescription(`Removed trigger: **${trigger}**`)
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'list') {
        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('📝 Auto Responders')
          .setDescription(
            guildData.autoResponders.length > 0
              ? guildData.autoResponders.map(ar => `**${ar.trigger}** → ${ar.response}`).join('\n')
              : 'No auto responders set'
          )
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};