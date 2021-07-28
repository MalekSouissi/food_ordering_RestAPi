const mongoose = require("mongoose");

const Supplement = mongoose.model(
    "Supplement",
    new mongoose.Schema({
        title: String,
        //food: { type: Schema.Types.ObjectId, ref: 'Food' },

    })
);

module.exports = Supplement;