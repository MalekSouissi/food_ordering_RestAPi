const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let expiredAt = new Date();

expiredAt.setSeconds(
    expiredAt.getSeconds() + 3600
);

let OrderItem = new Schema({
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
    ],

    total: {
        default: 0,
        type: Number,
    },

     totalPoints: {
        default: 0,
        type: Number,
    }
});
const Order = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    orderItems: 
        {
            type: [OrderItem],
    default: undefined
        }
    ,

    code: String,
    delivery: Boolean,
    done: Boolean,
    deliveryDate: {
        type: Date,
        default: expiredAt.getTime(),

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("order", Order);