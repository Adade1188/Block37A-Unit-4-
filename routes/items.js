
const express = require('express');
const Item = require('../models/Item');
const Review = require('../models/Review');
const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get item by ID
router.get('/:itemId', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.itemId);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get reviews for a specific item
router.get('/:itemId/reviews', async (req, res) => {
    try {
        const reviews = await Review.findAll({ where: { ItemId: req.params.itemId }, include: 'User' });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
