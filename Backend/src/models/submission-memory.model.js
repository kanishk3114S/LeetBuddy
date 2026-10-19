import mongoose from "mongoose";

const submissionMemorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    index: true
  },
  leetcodeUsername: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  problemTitle: {
    type: String,
    required: true,
    trim: true
  },
  problemSlug: {
    type: String,
    default: "",
    trim: true
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard", "Unknown"],
    default: "Medium"
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String, // "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", etc.
    default: "Accepted"
  },
  language: {
    type: String,
    default: "cpp"
  },
  code: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  errorCause: {
    type: String,
    default: null
  },
  contestTitle: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export const SubmissionMemory = mongoose.model("SubmissionMemory", submissionMemorySchema);
export default SubmissionMemory;
