import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  lastRegistrationDate: { type: String, required: true },  
  startDate: { type: String, required: true },  
  endDate: { type: String, required: true },  
  maxCount: { type: Number, required: true }, // New field for max students
  registeredStudents: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      rollNumber: String,
      department: String,
      year: String
    }
  ]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
