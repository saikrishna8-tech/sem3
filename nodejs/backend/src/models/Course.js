import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      trim: true
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
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

// Text index for search
courseSchema.index({ courseName: 'text', description: 'text', category: 'text' });

const Course = mongoose.model('Course', courseSchema);
export default Course;
