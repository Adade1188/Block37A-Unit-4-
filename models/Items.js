
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    averageRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});
module.exports = Item;

// models/Review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Item = require('./Item');
const Review = sequelize.define('Review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
User.hasMany(Review, { onDelete: 'CASCADE' });
Review.belongsTo(User);
Item.hasMany(Review, { onDelete: 'CASCADE' });
Review.belongsTo(Item);
module.exports = Review;

// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Review = require('./Review');
const Comment = sequelize.define('Comment', {
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
User.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(User);
Review.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Review);
module.exports = Comment;
