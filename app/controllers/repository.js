const Cart = require("../models/Cart.js");
exports.cart = async (userId) => {
    const cart = await Cart.findOne({userId}).populate({
        path: "items.food",
        select: "title price "
    });;
    return cart;
};
exports.addItem = async payload => {
    const newItem = await Cart.create(payload);
    return newItem
}