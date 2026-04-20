const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'participant', enum: ['participant', 'judge', 'admin'] }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

// Static methods to replace MySQL ones
userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email });
};

userSchema.statics.findById = async function(id) {
  return this.findOne({ _id: id });
};

userSchema.statics.create = async function({ name, email, password, role }) {
  if (!name || !email || !password) {
    throw new Error("Missing required fields");
  }
  const user = new this({ name, email, password, role: role || 'participant' });
  await user.save();
  return user;
};

userSchema.statics.findAllParticipants = async function() {
  return this.find({ role: 'participant' }).select('id name email created_at');
};

// Virtual for 'id' to map _id strings
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
userSchema.set('toJSON', { 
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);