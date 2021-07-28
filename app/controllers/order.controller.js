const Food = require("../models/food.model");
const OrderItem = require("../models/orderItem.model");
const Order = require("../models/order.model");

exports.createOrder = (req, res) => {

    const order = new Order({
        userId: req.body.userId,
        code: req.body.code,
        delivery: req.body.delivery,
        done: req.body.done,
    });
    order.save((err, order) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        OrderItem.find(
            {
                _id: { $in: req.body.orderItems },
            },
            (err, orderItems) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                order.orderItems = orderItems.map((orderItem) => orderItem._id);

                order.save((err) => {
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

exports.addOrderItem = async (req, res) => {
    const itemId = req.params.itemId;
    try {
        //validate data as required

        //const orderItem = new orderItem({
        //title: req.body.title,

        // });
        orderItem = await OrderItem.findById(itemId);
        const order = await Order.findById({ _id: req.params.id })
        order.orderItems.push(orderItem);
        await order.save();

        //return new book object, after saving it to Publisher
        res.status(200).json({ success: true, data: order })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

exports.deleteOrderItem = async (req, res) => {
    const itemId = req.params.itemId;
    try {

        orderItem = await OrderItem.findById(itemId);
        const order = await Order.findById({ _id: req.params.id })
        order.orderItems.pull(orderItem);
        await order.save();
        res.status(200).json({ success: true, data: order })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

exports.findOrders = async (req, res) => {
    try {
        const data = await Order.find()
            .populate({ path: 'orderItems', select: "food supplements other qte" });
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

exports.findOrder = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id).
            populate({ path: 'userId', select: 'username' })
            .populate({ path: 'orderItems', populate: { path: 'food', select: 'title price' } }).
            populate({ path: 'orderItems', populate: { path: 'supplements', select: 'title' } });
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

exports.findOrderByUserID = async (req, res) => {
    Order.find({ userId: req.params.id })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving foods."
            });
        });
}
