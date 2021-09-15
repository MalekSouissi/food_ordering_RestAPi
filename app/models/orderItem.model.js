const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItem = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    food:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food"
    }
    ,
    qte: {
        type:Number,
    min: [1, 'Quantity can not be less then 1.']
    },
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