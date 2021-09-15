const Food = require("../models/food.model");
const OrderItem = require("../models/orderItem.model");
const Supplement = require("../models/supplement.model");

exports.createOrderItem = (req, res) => {
var docsToInsert=[];

var i;
for (i = 0; i < req.body.length; i++) {
       const orderItem= new OrderItem({
food:req.body[i].food,
supplements:req.body[i].supplements,
qte:req.body[i].qte,
other:req.body[i].other
       });

       // docsToInsert.push(orderItem);
       orderItem
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


//docsToInsert.save(function (err) {
  //if (err) return console.log(err);

  //console.log('tmp saved to the database');

//});

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
    const supplement = req.params.supp;
    try {
        //validate data as required

        //const supplement = new Supplement({
        //title: req.body.title,

        // });
        //supplement = await Supplement.findById(suppId);
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
    const supplement = req.params.supp;
    try {

        // supplement = await Supplement.findById(suppId);
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
            .populate('food');

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