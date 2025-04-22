import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(null, false);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    console.log('Authenticated User:', req.user);  
    const courses = await Course.find().lean(); // Use lean() for better performance
    const user = await User.findById(req.user.userId);

    console.log('Fetched Courses:', courses);

    const coursesWithStatus = courses.map(course => ({
      ...course,
      isRegistered: user.registeredCourses.includes(course._id),
      currentCount: course.registeredStudents.length,  // ✅ Add current registered count
    }));

    res.json(coursesWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get registered courses for current student
router.get('/registered', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const courses = await Course.find({
      '_id': { $in: user.registeredCourses }
    }).lean();

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Add new course (admin only)
router.post('/add', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    console.log('Request Body:', req.body);

    const { name, description, lastRegistrationDate, startDate, endDate, maxCount } = req.body;

    if (!name || !description || !lastRegistrationDate || !startDate || !endDate || !maxCount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (isNaN(maxCount) || maxCount <= 0) {
      return res.status(400).json({ message: 'Invalid max student count' });
    }

    const course = new Course({
      name,
      description,
      image: req.file.path,
      lastRegistrationDate,
      startDate,
      endDate,
      maxCount,
      registeredStudents: [] // Initialize empty registeredStudents array
    });

    await course.save();
    res.status(201).json({ message: 'Course added successfully', course });

  } catch (err) {
    res.status(500).json({ message: 'Error adding course', error: err.message });
  }
});

// ✅ Get course registrations (admin only)
router.get('/registrations', adminAuth, async (req, res) => {
  try {
    const courses = await Course.find().populate('registeredStudents', 'username').lean();
    
    const formattedRegistrations = courses.map(course => ({
      _id: course._id,
      name: course.name,
      students: course.registeredStudents.map(student => ({
        username: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        year: student.year
      })),
      currentCount: course.registeredStudents.length, // ✅ Add current registered count
      maxCount: course.maxCount
    }));
    
    res.json(formattedRegistrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Register for a course
router.post('/:id/register', auth, async (req, res) => {
  try {
    const { name, rollNumber, department, year } = req.body;
    if (!name || !rollNumber || !department || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.registeredStudents.length >= course.maxCount) {
      return res.status(400).json({ message: 'Course is full' });
    }

    const user = await User.findById(req.user.userId);
    if (user.registeredCourses.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }

    user.registeredCourses.push(course._id);
    await user.save();

    course.registeredStudents.push({
      user: user._id,
      name,
      rollNumber,
      department,
      year
    });
    await course.save();

    res.json({ message: 'Successfully registered for the course' });

  } catch (err) {
    res.status(500).json({ message: 'Error registering for course', error: err.message });
  }
});

// ✅ Update course (admin only)
router.put('/:id/edit', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const updatedData = { ...req.body };
    if (req.file) updatedData.image = req.file.path;

    await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});

// ✅ Delete course (admin only)
router.delete('/:id/delete', adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
});




export default router;
