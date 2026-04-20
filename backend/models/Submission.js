const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  github_link: { type: String, required: true },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
}, { timestamps: { createdAt: 'submitted_at', updatedAt: false } });

// Helper to calculate scores
async function attachScoresToSubmission(sub, Score) {
  const scores = await Score.find({ submission_id: sub._id }).lean();
  let avg_score = 0;
  if (scores.length > 0) {
    avg_score = scores.reduce((a, b) => a + b.score, 0) / scores.length;
  }
  return {
    ...sub,
    id: sub._id.toHexString(),
    avg_score: Number(avg_score.toFixed(1)),
    score_count: scores.length
  };
}

submissionSchema.statics.submit = async function({ team_id, event_id, title, description, github_link }) {
  const sub = new this({
    team_id,
    event_id: event_id || null,
    title,
    description,
    github_link
  });
  await sub.save();
  return this.findById(sub._id);
};

submissionSchema.statics.update = async function(id, updates, values) {
  // Translate SQL-like updates array ("title = ?", "description = ?")
  const updateObj = {};
  updates.forEach((updateStr, index) => {
    const field = updateStr.split(' =')[0].trim();
    updateObj[field] = values[index];
  });
  
  await this.updateOne({ _id: id }, { $set: updateObj });
  return this.findById(id);
};

submissionSchema.statics.findById = async function(id) {
  const sub = await this.findOne({ _id: id })
    .populate('team_id', 'name')
    .populate('event_id', 'title')
    .lean();
    
  if (!sub) return null;

  const Score = mongoose.model('Score');
  const res = await attachScoresToSubmission(sub, Score);
  
  res.team_name = sub.team_id?.name;
  res.event_name = sub.event_id?.title;
  return res;
};

submissionSchema.statics.findByTeam = async function(team_id) {
  const sub = await this.findOne({ team_id }).lean();
  if (!sub) return null;
  return { id: sub._id.toHexString() };
};

submissionSchema.statics.verifyTeamAccess = async function(submission_id, user_id) {
  const sub = await this.findOne({ _id: submission_id }).lean();
  if (!sub) return null;
  
  const Team = mongoose.model('Team');
  const team = await Team.findOne({ _id: sub.team_id, "members.user_id": user_id }).lean();
  
  return team ? { id: sub._id.toHexString() } : null;
};

submissionSchema.statics.findAll = async function(role, user_id, limit = 50, offset = 0) {
  if (!user_id && role !== 'admin') {
    throw new Error("Unauthorized: user_id is undefined");
  }

  const Score = mongoose.model('Score');
  const Team = mongoose.model('Team');
  const Event = mongoose.model('Event');
  
  let matchQuery = {};

  if (role === 'judge') {
    // Find events where judge is assigned
    const judgeEvents = await Event.find({ "judges.judge_id": user_id }).select('_id').lean();
    const eventIds = judgeEvents.map(e => e._id);
    matchQuery = { event_id: { $in: eventIds } };
  } else if (role === 'participant') {
    if (!user_id) return [];
    // Find teams where user is a member
    const userTeams = await Team.find({ "members.user_id": user_id }).select('_id').lean();
    const teamIds = userTeams.map(t => t._id);
    matchQuery = { team_id: { $in: teamIds } };
  }

  const submissions = await this.find(matchQuery)
    .populate('team_id', 'name')
    .populate('event_id', 'title')
    .sort({ submitted_at: -1 })
    .skip(Number(offset))
    .limit(Number(limit))
    .lean();

  const results = await Promise.all(submissions.map(async (sub) => {
    const s = await attachScoresToSubmission(sub, Score);
    s.team_name = sub.team_id?.name;
    s.event_name = sub.event_id?.title;

    if (role === 'judge') {
      const myScore = await Score.findOne({ submission_id: sub._id, judge_id: user_id }).lean();
      s.my_score = myScore ? myScore.score : null;
    }
    return s;
  }));

  return results;
};

submissionSchema.virtual('id').get(function() { return this._id.toHexString(); });
submissionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Submission', submissionSchema);
