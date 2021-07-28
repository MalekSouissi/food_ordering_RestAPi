module.exports = app => {
    const supplements = require("../controllers/supp.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", supplements.create);

    // Retrieve all supplements
    router.get("/", supplements.findAll);

    // Retrieve all published supplements
    router.get("/available", supplements.findAllAvailable);

    // Retrieve a single Tutorial with id
    router.get("/:id", supplements.findOne);

    // Update a Tutorial with id
    router.put("/:id", supplements.update);

    // Delete a Tutorial with id
    router.delete("/:id", supplements.delete);

    // Create a new Tutorial
    router.delete("/", supplements.deleteAll);

    app.use('/api/supplements', router);
};