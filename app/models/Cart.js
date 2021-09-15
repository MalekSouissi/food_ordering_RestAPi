const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//const OrderItem = require("../models/orderItem.model");
let OrderItem = new Schema({
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
    }
});

const CartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
   items: {
    type: [OrderItem],
    default: undefined
  },
    subTotal: {
        default: 0,
        type: Number
    },
}, 
{
    timestamps: true
});
module.exports = mongoose.model('cart', CartSchema);

