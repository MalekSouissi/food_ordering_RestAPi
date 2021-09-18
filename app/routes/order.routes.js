module.exports = app => {
    const orders = require("../controllers/order.controller.js");

    var router = require("express").Router();

    router.post("/", orders.createOrder);
    router.get("/getOrders", orders.findOrders);
    router.post("/add/:id", orders.newOrder);
    router.post("/updateOrder/:id/:itemId", orders.deleteOrderItem);
    router.post("/addOrderItem/:id/:itemId", orders.addOrderItem);
    router.get("/getOrder/:id", orders.findOrder);
    router.get("/getUserOrder/:id", orders.findOrderByUserID);
    router.put("/order/:id", orders.update);
    router.delete("/order/:id",orders.delete);
    app.use('/api/orders', router);
};