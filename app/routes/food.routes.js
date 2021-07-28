module.exports = app => {
    const foods = require("../controllers/food.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", foods.create);
    router.post("/addSupplement/:id/:suppId", foods.addSupplement);
    router.post("/deleteSuppelement/:id/:suppId", foods.deleteSupp);


    // Retrieve all foods
    router.get("/", foods.findAll);
    router.get("/123", foods.findFoods);
    // Retrieve all published foods
    router.get("/available", foods.findAllAvailable);

    // Retrieve a single Tutorial with id
    router.get("/:id", foods.findOne);

    // Update a Tutorial with id
    router.put("/:id", foods.update);

    // Delete a Tutorial with id
    router.delete("/:id", foods.delete);

    // Create a new Tutorial
    router.delete("/", foods.deleteAll);

    app.use('/api/foods', router);
};