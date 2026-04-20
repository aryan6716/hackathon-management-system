const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  leader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  team_code: { type: String, required: true, unique: true },
  members: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joined_at: { type: Date, default: Date.now }
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

teamSchema.statics.create = async function({ team_name, leader_id, event_id, team_code }) {
  const team = new this({
    name: team_name,
    leader_id,
    event_id: event_id || null,
    team_code
  });
  await team.save();
  return team._id.toHexString();
};

teamSchema.statics.findByName = async function(team_name) {
  const t = await this.findOne({ name: team_name }).lean();
  if (!t) return null;
  return { id: t._id.toHexString() };
};

teamSchema.statics.findByCode = async function(team_code) {
  const t = await this.findOne({ team_code }).lean();
  if (!t) return null;
  return { ...t, id: t._id.toHexString(), team_name: t.name };
};

teamSchema.statics.findById = async function(id) {
  const t = await this.findOne({ _id: id })
    .populate('leader_id', 'name')
    .populate('event_id', 'title')
    .lean();
  if (!t) return null;
  
  return {
    ...t,
    id: t._id.toHexString(),
    team_name: t.name,
    leader_name: t.leader_id?.name,
    event_name: t.event_id?.title
  };
};

teamSchema.statics.addMember = async function(team_id, user_id) {
  await this.updateOne(
    { _id: team_id },
    { $addToSet: { members: { user_id } } }
  );
};

teamSchema.statics.isMember = async function(team_id, user_id) {
  const t = await this.findOne({ _id: team_id, "members.user_id": user_id }).lean();
  return !!t;
};

teamSchema.statics.hasTeamForEvent = async function(user_id, event_id) {
  const t = await this.findOne({ "members.user_id": user_id, event_id }).lean();
  return !!t;
};

teamSchema.statics.getMembers = async function(team_id) {
  const team = await this.findOne({ _id: team_id }).populate('members.user_id', 'name email').lean();
  if (!team || !team.members) return [];

  return team.members.map(m => ({
    id: m.user_id?._id,
    name: m.user_id?.name,
    email: m.user_id?.email,
    joined_at: m.joined_at
  }));
};

teamSchema.statics.findAll = async function() {
  const teams = await this.find()
    .populate('leader_id', 'name')
    .populate('event_id', 'title')
    .sort({ created_at: -1 })
    .lean();

  return teams.map(t => ({
    ...t,
    id: t._id.toHexString(),
    team_name: t.name,
    leader_name: t.leader_id?.name,
    event_name: t.event_id?.title,
    member_count: t.members ? t.members.length : 0
  }));
};

teamSchema.statics.findByUser = async function(user_id) {
  const t = await this.findOne({ "members.user_id": user_id })
    .populate('leader_id', 'name')
    .populate('event_id', 'title')
    .lean();
  
  if (!t) return null;

  return {
    ...t,
    id: t._id.toHexString(),
    team_name: t.name,
    leader_name: t.leader_id?.name,
    event_name: t.event_id?.title
  };
};

teamSchema.virtual('id').get(function() { return this._id.toHexString(); });
teamSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Team', teamSchema);
