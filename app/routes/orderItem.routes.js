module.exports = app => {
    const orderItem = require("../controllers/orderItem.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/addOrderItem", orderItem.createOrderItem);
    router.post("/addSupplement/:id/:supp", orderItem.addSupplement);
    router.post("/deleteSuppelement/:id/:supp", orderItem.deleteSupp);
    router.get("/getOrderItem/:id", orderItem.findOrderItem);
    //router.get("/getOrderItemByUserId/:userId".orderItem.getOrderItems2);
    router.get("/getOrderItems", orderItem.findOrderItems);
    app.use('/api/orders', router);
};