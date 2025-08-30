// routes/events.js
import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// ✅ Create Event
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ✅ Get All Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ✅ Get Events History for Student (all statuses)
router.get('/history', async (req, res) => {
  try {
    // later you can filter by studentId (from token), for now return all
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// ✅ Get Event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ✅ Update Event (General Edit)
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ✅ Approve / Reject Event (Admin Only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason: status === 'rejected' ? rejectionReason : '' },
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: `Event ${status} successfully`, event: updatedEvent });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ✅ Delete Event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
