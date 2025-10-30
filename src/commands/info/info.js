const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about KIWI bot'),
  cooldown: 5,
  async execute(interaction, client) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const uptimeStr = `${days}d ${hours}h ${minutes}m`;

    const embed = new EmbedBuilder()
      .setColor('#00ffb3')
      .setTitle('🤖 KIWI BOT INFO')
      .setDescription('Your all-in-one premium Discord assistant!')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '👑 Developer', value: 'Pixel Beast 🍃', inline: true },
        { name: '🧩 Version', value: client.config.version, inline: true },
        { name: '⚙️ Prefix', value: client.config.defaultPrefix, inline: true },
        { name: '🏓 Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '⏰ Uptime', value: uptimeStr, inline: true },
        { name: '📊 Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
        { name: '💬 Commands', value: `${client.commands.size}`, inline: true },
        { name: '💾 Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
      )
      .setFooter({ text: 'Made by Pixel Beast 🍃', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};