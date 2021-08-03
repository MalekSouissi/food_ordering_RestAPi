const Food = require("../models/food.model");
const Supplement = require("../models/supplement.model");
//const Food = db.foods;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a food
    const food = new Food({
        title: req.body.title,
        description: req.body.description,
        available: req.body.available ? req.body.available : true,
        price: req.body.price,
        points: req.body.points,
        category: req.body.category,
    });

    // Save food in the database

    food
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the food."
            });
        });
};

exports.addSupplement = async (req, res) => {
    const suppId = req.params.suppId;
    try {
        //validate data as required

        //const supplement = new Supplement({
        //title: req.body.title,

        // });
        supplement = await Supplement.findById(suppId);
        const food = await Food.findById({ _id: req.params.id })
        food.supplements.push(supplement);
        await food.save();

        //return new book object, after saving it to Publisher
        res.status(200).json({ success: true, data: supplement })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}



exports.deleteSupp = async (req, res) => {
    const suppId = req.params.suppId;
    try {

        supplement = await Supplement.findById(suppId);
        const food = await Food.findById({ _id: req.params.id })
        food.supplements.pull(supplement);
        await food.save();
        res.status(200).json({ success: true, data: food })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
};


// Retrieve all foods from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Food.find(condition).populate({ path: 'category', select: "name" })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving foods."
            });
        });
};

exports.findFoods = async (req, res) => {
    try {
        const data = await Food.find()
            .populate({ path: 'supplements', select: "title" });
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
// Find a single Food with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Food.findById(id).populate({ path: 'category', select: "name" })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Food with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Food with id=" + id });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Food.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Food with id=${id}. Maybe Food was not found!`
                });
            } else res.send({ message: "Food was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Food with id=" + id
            });
        });
};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Food.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Food with id=${id}. Maybe Food was not found!`
                });
            } else {
                res.send({
                    message: "Food was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Food with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Food.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} foods were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all foods."
            });
        });
};

// Find all published Tutorials
exports.findAllAvailable = (req, res) => {
    Food.find({ available: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving available foods."
            });
        });
};

