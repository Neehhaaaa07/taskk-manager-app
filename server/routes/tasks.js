const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // Protect routes

// @route   GET api/tasks
// @desc    Get all user tasks (with Pagination)
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const query = { user: req.user.id }; // Only get tasks for logged in user

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { priority: -1, dueDate: 1 }
        };

        const result = await Task.paginate(query, options);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/:id
// @desc    Get single task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        res.json(task);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') return res.status(404).json({ msg: 'Task not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks
// @desc    Create a new task
router.post('/', auth, async (req, res) => {
    try {
        const newTask = new Task({
            ...req.body,
            user: req.user.id
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
router.put('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Ensure user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update the task
        task = await Task.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true } // Return the updated document
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;