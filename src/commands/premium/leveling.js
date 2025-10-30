const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const User = require('../../database/models/User');
const Guild = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leveling')
    .setDescription('Manage leveling system')
    .addSubcommand(subcommand =>
      subcommand
        .setName('rank')
        .setDescription('Check your rank')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to check')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('leaderboard')
        .setDescription('View server leaderboard'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('toggle')
        .setDescription('Toggle leveling system')
        .addBooleanOption(option =>
          option.setName('enabled')
            .setDescription('Enable or disable')
            .setRequired(true))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === 'rank') {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userData = await User.findOne({ userId: targetUser.id, guildId: interaction.guild.id });

        if (!userData) {
          return interaction.reply({ content: '❌ No data found for this user!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle(`📊 ${targetUser.username}'s Rank`)
          .addFields(
            { name: '📈 Level', value: `${userData.level}`, inline: true },
            { name: '⭐ XP', value: `${userData.xp}/${userData.level * 100}`, inline: true }
          )
          .setThumbnail(targetUser.displayAvatarURL())
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'leaderboard') {
        const users = await User.find({ guildId: interaction.guild.id }).sort({ level: -1, xp: -1 }).limit(10);

        const leaderboard = users.map((user, index) => {
          return `**${index + 1}.** <@${user.userId}> - Level ${user.level} (${user.xp} XP)`;
        }).join('\n');

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('🏆 Server Leaderboard')
          .setDescription(leaderboard || 'No data available')
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'toggle') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({ content: '❌ You need Administrator permission!', ephemeral: true });
        }

        const enabled = interaction.options.getBoolean('enabled');
        
        let guildData = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildData) {
          guildData = await Guild.create({ guildId: interaction.guild.id });
        }

        guildData.leveling.enabled = enabled;
        await guildData.save();

        const embed = new EmbedBuilder()
          .setColor('#00ffb3')
          .setTitle('✅ Leveling System Updated')
          .setDescription(`Leveling system is now **${enabled ? 'enabled' : 'disabled'}**`)
          .setFooter({ text: 'Made by Pixel Beast 🍃' })
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};