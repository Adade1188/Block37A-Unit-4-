
const express = require('express');
const auth = require('../middlewares/auth');
const Review = require('../models/Review');
const Item = require('../models/Item');
const router = express.Router();

// Get review by ID
router.get('/:itemId/reviews/:reviewId', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId, { include: 'User' });
        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create review for an item
router.post('/:itemId/reviews', auth, async (req, res) => {
    const { rating, text } = req.body;
    try {
        const item = await Item.findByPk(req.params.itemId);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        const existingReview = await Review.findOne({ where: { UserId: req.user.id, ItemId: req.params.itemId } });
        if (existingReview) {
            return res.status(400).json({ msg: 'Review already exists for this item' });
        }
        const review = await Review.create({
            UserId: req.user.id,
            ItemId: req.params.itemId,
            rating,
            text
        });
        item.totalReviews += 1;
        item.averageRating = ((item.averageRating * (item.totalReviews - 1)) + rating) / item.totalReviews;
        await item.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get reviews by logged-in user
router.get('/me', auth, async (req, res) => {
    try {
        const reviews = await Review.findAll({ where: { UserId: req.user.id }, include: 'Item' });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update review
router.put('/:userId/reviews/:reviewId', auth, async (req, res) => {
    const { rating, text } = req.body;
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }
        if (review.UserId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        review.rating = rating;
        review.text = text;
        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete review
router.delete('/:userId/reviews/:reviewId', auth, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }
        if (review.UserId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await review.destroy();
        res.json({ msg: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
