import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    icon: {
      type: String,
      default: "CreditCard",
    },
    category: {
      type: String,
      required: [true, "Please specify an expense category"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide an expense description"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter a valid amount"],
      min: [0.01, "Amount must be greater than 0"],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: "Credit Card",
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

// ✅ Synchronous pre-save hook (NO 'next' callback)
expenseSchema.pre("save", function () {
  if (!this.category) {
    this.category = "Other";
  }
});

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
