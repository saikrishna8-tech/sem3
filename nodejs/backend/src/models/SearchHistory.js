import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Can be guest user
      index: true
    },
    query: {
      type: String,
      required: [true, 'Query text is required'],
      trim: true,
      index: true
    },
    resultsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory;
