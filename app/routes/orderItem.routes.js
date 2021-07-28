module.exports = app => {
    const orderItem = require("../controllers/orderItem.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/addOrderItem", orderItem.createOrderItem);
    router.post("/addSupplement/:id/:suppId", orderItem.addSupplement);
    router.post("/deleteSuppelement/:id/:suppId", orderItem.deleteSupp);
    router.get("/getOrderItem/:id", orderItem.findOrderItem);
    app.use('/api/orders', router);
};