const Food = require("../models/food.model.js");
exports.foods = async () => {
    const foods = await Food.find();
    return foods;
};
exports.foodById = async id => {
    const food = await Food.findById(id);
    return food;
}
exports.createFood = async payload => {
    const newFood = await Food.create(payload);
    return newFood
}
exports.removeFood = async id => {
    const food = await Food.findByIdAndRemove(id);
    return food
}