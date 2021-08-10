const Food = require("../models/food.model");
const OrderItem = require("../models/orderItem.model");
const Supplement = require("../models/supplement.model");

exports.createOrderItem = (req, res) => {

    const orderItem = new OrderItem({
        //_id: mongoose.Types.ObjectId(),
        userId: req.body.userId,
        qte: req.body.qte,
        food: req.body.food,
        other: req.body.other
    });
    orderItem.save((err, orderItem) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Supplement.find(
            {
                title: { $in: req.body.supplements },
            },
            (err, supplements) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                orderItem.supplements = supplements.map((supplement) => supplement._id);

                orderItem.save((err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: "Order was registered successfully!" });
                });
            }
        );


    });


};


exports.findOrderItems = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    OrderItem.find(condition)
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
exports.addSupplement = async (req, res) => {
    const suppId = req.params.suppId;
    try {
        //validate data as required

        //const supplement = new Supplement({
        //title: req.body.title,

        // });
        supplement = await Supplement.findById(suppId);
        const orderItem = await OrderItem.findById({ _id: req.params.id })
        orderItem.supplements.push(supplement);
        await orderItem.save();

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
        const orderItem = await OrderItem.findById({ _id: req.params.id })
        orderItem.supplements.pull(supplement);
        await orderItem.save();
        res.status(200).json({ success: true, data: orderItem })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
};

exports.findOrderItem = async (req, res) => {
    try {
        const data = await OrderItem.findById(req.params.id)
            .populate('food').
            populate({ path: 'supplements', select: "title" });

        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

/*exports.getOrderItems2 = async (req, res) => {
    OrderItem.find({ userId: req.params.id })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving orderItems."
            });
        });
};*/