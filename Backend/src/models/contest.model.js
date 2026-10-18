import mongoose from "mongoose";

const questionDeepDiveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleSlug: {
    type: String,
    default: ""
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard", "Unknown"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: [
      "Accepted",
      "Wrong Answer",
      "Time Limit Exceeded",
      "Memory Limit Exceeded",
      "Runtime Error",
      "Compile Error",
      "Not Attempted"
    ],
    default: "Not Attempted"
  },
  failCount: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: null
  },
  submissionCode: {
    type: String,
    default: null
  },
  errorCause: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Number,
    default: null
  }
}, { _id: false });

const recentContestDeepDiveSchema = new mongoose.Schema({
  contestTitle: {
    type: String,
    required: true
  },
  startTime: {
    type: Number,
    required: true
  },
  ranking: {
    type: Number,
    default: 0
  },
  ratingAfter: {
    type: Number,
    required: true
  },
  ratingDelta: {
    type: Number,
    default: 0
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  totalProblems: {
    type: Number,
    default: 4
  },
  finishTimeInSeconds: {
    type: Number,
    default: 0
  },
  questions: [questionDeepDiveSchema]
}, { _id: false });

const contestHistorySchema = new mongoose.Schema({
  contestTitle: {
    type: String,
    required: true
  },
  startTime: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  ranking: {
    type: Number,
    default: 0
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  totalProblems: {
    type: Number,
    default: 4
  },
  finishTimeInSeconds: {
    type: Number,
    default: 0
  },
  trendDirection: {
    type: String,
    enum: ["UP", "DOWN", "NONE"],
    default: "NONE"
  }
}, { _id: false });

const contestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    index: true,
    default: null
  },
  leetcodeUsername: {
    type: String,
    required: [true, "LeetCode username is required"],
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  summary: {
    attendedContestsCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 1500
    },
    PeakRating: {
      type: Number,
      default: 1500
    },
    peakRating: {
      type: Number,
      default: 1500
    },
    lowestRating: {
      type: Number,
      default: 1500
    },
    globalRanking: {
      type: Number,
      default: 0
    },
    totalParticipants: {
      type: Number,
      default: 0
    },
    topPercentage: {
      type: Number,
      default: 0
    },
    badge: {
      type: String,
      default: null
    }
  },
  contestHistory: [contestHistorySchema],
  recentFiveContestsDeepDive: [recentContestDeepDiveSchema],
  aiDeepDiveRemediation: {
    generatedAt: { type: Date, default: null },
    model: { type: String, default: null },
    weakTopicDiagnoses: [
      {
        topic: { type: String },
        whyUnderPressure: { type: String },
        symptoms: [{ type: String }],
        recommendedProblems: [
          {
            title: { type: String },
            titleSlug: { type: String },
            difficulty: { type: String },
            targetSolveTime: { type: String },
            focusNote: { type: String }
          }
        ]
      }
    ],
    questionBlueprints: [
      {
        title: { type: String },
        titleSlug: { type: String },
        contestTitle: { type: String },
        whyYouBled: { type: String },
        coreTrick: { type: String },
        targetComplexity: { type: String }
      }
    ]
  },
  lastSyncedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure compound index for fast queries by userId and username
contestSchema.index({ userId: 1, leetcodeUsername: 1 });

const Contest = mongoose.models.Contest || mongoose.model("Contest", contestSchema);

export default Contest;
