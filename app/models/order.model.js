/*const mongoose = require("mongoose");

const Order = mongoose.model(
    "Order",
    new mongoose.Schema({
        code: String,
        qte: int,
        delivery: Boolean,
        done: Boolean,
        time: time,
        createdAt: Date
    })
);

module.exports = Comment;*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let expiredAt = new Date();

expiredAt.setSeconds(
    expiredAt.getSeconds() + 3600
);
const Order = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderItem"
        }
    ],

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