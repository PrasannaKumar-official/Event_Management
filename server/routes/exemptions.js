import express from 'express';
import Exemption from '../models/Exemption.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

//Get all exemption requests (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const exemptions = await Exemption.find()
      .populate('student', 'name username rollNumber year department') // ✅ Added 'name'
      .populate('completedCourses', 'name');

    console.log('Fetched Exemptions:', JSON.stringify(exemptions, null, 2)); // ✅ Pretty print with indentation

    res.json(exemptions);
  } catch (err) {
    console.error('Error fetching exemptions:', err); // ✅ Log errors
    res.status(500).json({ message: 'Server error' });
  }
});


// Get student's exemption status
router.get('/status', auth, async (req, res) => {
  try {
    const exemption = await Exemption.findOne({ 
      student: req.user.userId 
    })
    .sort({ createdAt: -1 })
    .populate('completedCourses', 'name');
    res.json(exemption);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for exemption
router.post('/apply', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { completedCourses, electiveCourse } = req.body;
    
    // Check if user has registered for the selected courses
    const hasAllCourses = completedCourses.every(courseId => 
      user.registeredCourses.includes(courseId)
    );

    if (!hasAllCourses) {
      return res.status(400).json({ 
        message: 'You must be registered for all selected courses' 
      });
    }

    if (completedCourses.length !== 3) {
      return res.status(400).json({ 
        message: 'Must select exactly 3 completed courses' 
      });
    }

    const exemption = new Exemption({
      student: req.user.userId,
      completedCourses,
      electiveCourse
    });
    await exemption.save();
    res.status(201).json(exemption);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update exemption status (admin only)
// Update exemption status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const exemption = await Exemption.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('completedCourses', 'name');

    if (status === 'approved') {
      const user = await User.findById(exemption.student);
      // Add completed courses
      user.completedCourses.push(...exemption.completedCourses);
      await user.save();
    }

    res.json(exemption);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exemption history for the logged-in student
router.get('/history', auth, async (req, res) => {
  try {
    const exemptions = await Exemption.find({ student: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('completedCourses', 'name')
      .select('completedCourses electiveCourse status rejectionReason'); // Include electiveCourse

    res.json(exemptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;