/*const { boolean } = require("joi");

module.exports = mongoose => {
    const Food = mongoose.model(
        "food",
        mongoose.Schema(
            {
                title: String,
                description: String,
                price: String,
                points: String,
                category: String,
                available: Boolean
            },
            { timestamps: true }
        )
    );

    return Food;
};*/

const mongoose = require('mongoose');

const Food = mongoose.Schema({
    title: String,
    description: String,
    price: String,
    points: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    available: Boolean,

}, {
    timestamps: true
});

module.exports = mongoose.model('Food', Food);