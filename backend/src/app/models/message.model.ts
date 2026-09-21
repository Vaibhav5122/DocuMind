import mongoose from "mongoose";

const citationSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    documentId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["USER", "ASSISTANT"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    citations: {
      type: [citationSchema],
      default: [],
    },
  },
  { timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
