const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  judges: [{
    judge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assigned_at: { type: Date, default: Date.now }
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

eventSchema.statics.create = async function({ name, description, start_date, end_date, created_by }) {
  const event = new this({
    title: name,
    description: description || '',
    start_date,
    end_date,
    created_by: created_by || null
  });
  await event.save();
  return this.findById(event._id);
};

eventSchema.statics.findAll = async function() {
  const events = await this.find().populate('created_by', 'name').sort({ start_date: -1 }).lean();
  
  const Team = mongoose.model('Team');
  const Submission = mongoose.model('Submission');

  return Promise.all(events.map(async (e) => {
    const team_count = await Team.countDocuments({ event_id: e._id });
    const submission_count = await Submission.countDocuments({ event_id: e._id });
    return {
      id: e._id.toHexString(),
      name: e.title,
      description: e.description,
      start_date: e.start_date,
      end_date: e.end_date,
      created_by: e.created_by?._id,
      created_by_name: e.created_by?.name,
      team_count,
      submission_count
    };
  }));
};

eventSchema.statics.findById = async function(id) {
  const e = await this.findOne({ _id: id }).populate('created_by', 'name').lean();
  if (!e) return null;

  const Team = mongoose.model('Team');
  const Submission = mongoose.model('Submission');

  const team_count = await Team.countDocuments({ event_id: e._id });
  const submission_count = await Submission.countDocuments({ event_id: e._id });

  return {
    id: e._id.toHexString(),
    name: e.title,
    description: e.description,
    start_date: e.start_date,
    end_date: e.end_date,
    created_by: e.created_by?._id,
    created_by_name: e.created_by?.name,
    team_count,
    submission_count
  };
};

eventSchema.statics.assignJudge = async function(judge_id, event_id) {
  await this.updateOne(
    { _id: event_id },
    { $addToSet: { judges: { judge_id } } }
  );
};

eventSchema.statics.isJudgeAssigned = async function(judge_id, event_id) {
  const event = await this.findOne({ _id: event_id, "judges.judge_id": judge_id });
  return !!event;
};

eventSchema.statics.getJudges = async function(event_id) {
  const event = await this.findOne({ _id: event_id }).populate('judges.judge_id', 'name email');
  if (!event || !event.judges) return [];
  
  return event.judges.map(j => ({
    id: j.judge_id?._id,
    name: j.judge_id?.name,
    email: j.judge_id?.email,
    assigned_at: j.assigned_at
  }));
};

eventSchema.virtual('id').get(function() { return this._id.toHexString(); });
eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
