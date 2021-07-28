const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItem = new Schema({
    food:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food"
    }
    ,
    qte: Number,
    other: String,
    supplements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplement"
        }
    ]
});

module.exports = mongoose.model("orderItem", OrderItem);