const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '/' },
  welcomeChannel: { type: String, default: null },
  welcomeMessage: { type: String, default: null },
  autoRole: { type: String, default: null },
  modLogChannel: { type: String, default: null },
  ticketCategory: { type: String, default: null },
  ticketCounter: { type: Number, default: 0 },
  leveling: {
    enabled: { type: Boolean, default: true },
    levelUpMessage: { type: Boolean, default: true }
  },
  automod: {
    enabled: { type: Boolean, default: true },
    antiSpam: { type: Boolean, default: true },
    antiInvite: { type: Boolean, default: true },
    badWords: { type: Array, default: [] }
  },
  autoResponders: { type: Array, default: [] },
  reactionRoles: { type: Array, default: [] },
  afkUsers: { type: Array, default: [] }
});

module.exports = mongoose.model('Guild', guildSchema);