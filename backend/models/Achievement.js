const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  title: String,
  description: String,
  iconType: String,
  earnedAt: { type: Date, default: Date.now },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' }
});

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  learningPoints: { type: Number, default: 0 },
  badges: [badgeSchema],
  rank: { type: String, default: 'Novice' }
}, { timestamps: true });

// Auto-calculate rank based on points before saving
achievementSchema.pre('save', function(next) {
  const pts = this.learningPoints;
  if (pts >= 1000) this.rank = 'Master Scholar';
  else if (pts >= 500) this.rank = 'Advanced Learner';
  else if (pts >= 250) this.rank = 'Dedicated Student';
  else if (pts >= 100) this.rank = 'Rising Star';
  else this.rank = 'Novice';
  next();
});

module.exports = mongoose.model('Achievement', achievementSchema);
