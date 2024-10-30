const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create Event (Admin Only)
router.post('/', auth(['admin']), async (req, res) => {
    const { title, category, description, date, maxRegistrations, imageUrl } = req.body;
    try {
        const event = new Event({
            title,
            category,
            description,
            date,
            maxRegistrations,
            imageUrl,
            createdBy: req.user.id,
        });
        await event.save();
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Events
router.get('/', auth(['admin', 'leader', 'judge', 'participant']), async (req, res) => {
    console.log('User accessing events:', req.user);
    try {
        const events = await Event.find().sort({ date: 1 }); // Sort by date ascending
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Single Event
router.get('/:id', auth(['admin', 'leader', 'judge', 'participant']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(`Error fetching event with id ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Event (Admin Only)
router.put('/:id', auth(['admin']), async (req, res) => {
    const { title, category, description, date, maxRegistrations, imageUrl } = req.body;
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.title = title;
        event.category = category;
        event.description = description;
        event.date = date;
        event.maxRegistrations = maxRegistrations;
        event.imageUrl = imageUrl;

        await event.save();
        res.json({ message: 'Event updated successfully', event });
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Event (Admin Only)
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.remove();
        res.json({ message: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Register for an Event (Participant Only)
router.post('/:id/register', auth(['participant']), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // Check if the event has reached its maximum registrations
        if (event.currentRegistrations >= event.maxRegistrations) {
            return res.status(400).json({ message: 'Event is full' });
        }
        
        // Increment the currentRegistrations
        event.currentRegistrations += 1;
        await event.save();
        
        res.json({ message: 'Successfully registered for the event', event });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
