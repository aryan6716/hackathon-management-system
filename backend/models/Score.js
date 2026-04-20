const mongoose = require('mongoose');

// Simple in-memory cache
let leaderboardCache = new Map();

const scoreSchema = new mongoose.Schema({
  submission_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  judge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  feedback: { type: String, default: '' },
}, { timestamps: { createdAt: 'scored_at', updatedAt: 'scored_at' } });

// Ensure one score per judge per submission
scoreSchema.index({ submission_id: 1, judge_id: 1 }, { unique: true });

scoreSchema.statics.submitScore = async function({ submission_id, judge_id, score, feedback }) {
  await this.findOneAndUpdate(
    { submission_id, judge_id },
    { score, feedback: feedback || '', scored_at: new Date() },
    { upsert: true, new: true }
  );

  leaderboardCache.clear();
};

scoreSchema.statics.getScoresBySubmission = async function(submission_id) {
  const scores = await this.find({ submission_id })
    .populate('judge_id', 'name')
    .sort({ scored_at: -1 })
    .lean();

  return scores.map(sc => ({
    id: sc._id.toHexString(),
    score: sc.score,
    feedback: sc.feedback,
    scored_at: sc.scored_at,
    judge_name: sc.judge_id?.name
  }));
};

scoreSchema.statics.getLeaderboard = async function(event_id, limit = 50, offset = 0) {
  const cacheKey = `board_${event_id || 'all'}_${limit}_${offset}`;
  const cached = leaderboardCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < 5000) {
    return cached.data;
  }

  const Submission = mongoose.model('Submission');
  
  let matchQuery = {};
  if (event_id) {
    matchQuery.event_id = new mongoose.Types.ObjectId(event_id);
  }

  const pipeline = [
    { $match: matchQuery },
    // Lookup scores
    {
      $lookup: {
        from: 'scores', // Mongoose usually lowercases and pluralizes model names
        localField: '_id',
        foreignField: 'submission_id',
        as: 'scores'
      }
    },
    // Only where there are scores
    { $match: { 'scores.0': { $exists: true } } },
    // Lookup team
    {
      $lookup: {
        from: 'teams',
        localField: 'team_id',
        foreignField: '_id',
        as: 'team'
      }
    },
    { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
    // Lookup event
    {
      $lookup: {
        from: 'events',
        localField: 'event_id',
        foreignField: '_id',
        as: 'event'
      }
    },
    { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
    // Calculate fields
    {
      $project: {
        submission_id: '$_id',
        title: 1,
        team_name: '$team.name',
        event_name: '$event.title',
        event_id: 1,
        judge_count: { $size: '$scores' },
        avg_score: { $avg: '$scores.score' }
      }
    },
    { $sort: { avg_score: -1 } },
    { $skip: Number(offset) },
    { $limit: Number(limit) }
  ];

  const results = await Submission.aggregate(pipeline);

  const formatted = results.map(row => ({
    ...row,
    submission_id: row.submission_id.toString(),
    avg_score: Number(row.avg_score.toFixed(1))
  }));

  leaderboardCache.set(cacheKey, {
    data: formatted,
    timestamp: Date.now()
  });

  return formatted;
};

module.exports = mongoose.model('Score', scoreSchema);
