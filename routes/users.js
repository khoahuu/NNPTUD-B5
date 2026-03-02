let express = require('express');
let router = express.Router();
let User = require('../schemas/users');
let Role = require('../schemas/roles');

// Create User
router.post('/', async (req, res) => {
    try {
        if (req.body.role) {
            let role = await Role.findOne({ name: req.body.role });
            if (role) req.body.role = role._id;
        }
        let user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Users
router.get('/', async (req, res) => {
    try {
        let users = await User.find({ isDeleted: { $ne: true } }).populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User by ID
router.get('/:id', async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).populate('role');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    try {
        if (req.body.role) {
            let role = await Role.findOne({ name: req.body.role });
            if (role) req.body.role = role._id;
        }
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            req.body,
            { new: true, runValidators: true }
        ).populate('role');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Soft Delete User
router.delete('/:id', async (req, res) => {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enable User
router.post('/enable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await User.findOneAndUpdate(
            { email, username, isDeleted: { $ne: true } },
            { status: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found or invalid credentials' });
        res.json({ message: 'User enabled successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Disable User
router.post('/disable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await User.findOneAndUpdate(
            { email, username, isDeleted: { $ne: true } },
            { status: false },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found or invalid credentials' });
        res.json({ message: 'User disabled successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
