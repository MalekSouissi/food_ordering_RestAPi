const router = require("express").Router();

module.exports = router;


module.exports = app => {
const cartController = require("../controllers/cart.controller.js");

    var router = require("express").Router();
router.post("/", cartController.addItemToCart);
router.post("/add/:userId",cartController.createCart);
//router.get("/:userId", cartController.getCart);
router.get("/carts",cartController.findCarts);
router.delete("/empty-cart", cartController.emptyCart);
    
    app.use('/api/cart', router);
};