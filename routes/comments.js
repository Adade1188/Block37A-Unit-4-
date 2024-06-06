
const express = require('express');
const auth = require('../middlewares/auth');
const Comment = require('../models/Comment');
const router = express.Router();

// Create comment on a review
router.post('/:itemId/reviews/:reviewId/comments', auth, async (req, res) => {
    const { text } = req.body;
    try {
        const comment = await Comment.create({
            UserId: req.user.id,
            ReviewId: req.params.reviewId,
            text
        });
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get comments by logged-in user
router.get('/me', auth, async (req, res) => {
    try {
        const comments = await Comment.findAll({ where: { UserId: req.user.id }, include: 'Review' });
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update comment
router.put('/:userId/comments/:commentId', auth, async (req, res) => {
    const { text } = req.body;
    try {
        const comment = await Comment.findByPk(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        if (comment.UserId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        comment.text = text;
        await comment.save();
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete comment
router.delete('/:userId/comments/:commentId', auth, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        if (comment.UserId !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await comment.destroy();
        res.json({ msg: 'Comment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
