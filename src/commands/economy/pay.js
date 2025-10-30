const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Pay money to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to pay')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to pay')
        .setRequired(true)
        .setMinValue(1)),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (targetUser.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot pay yourself!', ephemeral: true });
    }

    if (targetUser.bot) {
      return interaction.reply({ content: '❌ You cannot pay bots!', ephemeral: true });
    }

    try {
      let senderData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
      
      if (!senderData) {
        senderData = await User.create({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
          balance: 0,
          bank: 0
        });
      }

      if (senderData.balance < amount) {
        return interaction.reply({ content: '❌ You don\'t have enough money!', ephemeral: true });
      }

      let receiverData = await User.findOne({ userId: targetUser.id, guildId: interaction.guild.id });
      
      if (!receiverData) {
        receiverData = await User.create({
          userId: targetUser.id,
          guildId: interaction.guild.id,
          balance: 0,
          bank: 0
        });
      }

      senderData.balance -= amount;
      receiverData.balance += amount;
      
      await senderData.save();
      await receiverData.save();

      const embed = new EmbedBuilder()
        .setColor('#00ffb3')
        .setTitle('💸 Payment Successful!')
        .setDescription(`${interaction.user} paid **$${amount.toLocaleString()}** to ${targetUser}`)
        .setFooter({ text: 'Made by Pixel Beast 🍃' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }
};