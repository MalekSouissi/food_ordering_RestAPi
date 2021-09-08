const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItem = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
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
            //type: mongoose.Schema.Types.ObjectId,
            //ref: "Supplement"
            type: String,
        }
    ]
});

module.exports = mongoose.model("orderItem", OrderItem);