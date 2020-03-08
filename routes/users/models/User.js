const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
  profile: {
    name: { type: String, default: '' },
    picture: { type: String, default: '' }
  },
  address: { type: String, default: '(Please Update Address)' },
  history: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      paid: { type: Number, default: 0 },
      timestamp: {
        type: String,
        default: () => moment().format('MMMM Do YYYY, h:mm:ss a')
      }
    }
  ],
  timestamp: {
    type: String,
    default: () => moment().format('MMMM Do YYYY, h:mm:ss a')
  }
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;

      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
