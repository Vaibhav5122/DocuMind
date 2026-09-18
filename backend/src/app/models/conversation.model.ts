import mongoose from "mongoose";

const convesationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
  },
  { timestamps: true },
);

convesationSchema.index({ userId: 1, updatedAt: -1 });
export const Conversation = mongoose.model("Conversation", convesationSchema);
