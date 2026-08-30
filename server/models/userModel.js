import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    profileImageUrl: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'],
    },
    monthlyBudget: {
      type: Number,
      default: 3000,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('fullName').get(function () {
  return this.name;
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
