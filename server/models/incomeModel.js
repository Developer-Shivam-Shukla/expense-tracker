import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    icon: {
      type: String,
      default: "Wallet",
    },
    source: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide an income description/source"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter a valid amount"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Please specify an income category"],
      default: "Salary",
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: "Bank Transfer",
      enum: [
        "Bank Transfer",
        "Credit Card",
        "Debit Card",
        "Cash",
        "PayPal",
        "UPI",
        "Apple Pay",
        "Google Pay",
        "Cheque",
        "Other",
      ],
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

incomeSchema.pre("save", function (next) {
  if (!this.source && this.description) {
    this.source = this.description;
  }
  if (!this.description && this.source) {
    this.description = this.source;
  }
  next();
});

const Income = mongoose.models.Income || mongoose.model("Income", incomeSchema);

export default Income;
