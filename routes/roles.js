let express = require('express');
let router = express.Router();
let Role = require('../schemas/roles');

// Create Role
router.post('/', async (req, res) => {
    try {
        let role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Roles
router.get('/', async (req, res) => {
    try {
        let roles = await Role.find({ isDeleted: { $ne: true } });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Role by ID
router.get('/:id', async (req, res) => {
    try {
        let role = await Role.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Role
router.put('/:id', async (req, res) => {
    try {
        let role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            req.body,
            { new: true, runValidators: true }
        );
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Soft Delete Role
router.delete('/:id', async (req, res) => {
    try {
        let role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true }
        );
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
