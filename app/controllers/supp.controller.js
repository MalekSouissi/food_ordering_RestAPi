const Supplement = require("../models/supplement.model");
//const Food = db.foods;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a food
    const supplement = new Supplement({
        title: req.body.title,

    });

    // Save food in the database
    supplement
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

// Retrieve all foods from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Supplement.find(condition)
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
// Find a single Food with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Supplement.findById(id)
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

    Supplement.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

    Supplement.findByIdAndRemove(id)
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
    Supplement.deleteMany({})
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
    Supplement.find({ available: true })
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