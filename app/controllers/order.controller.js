const Food = require("../models/food.model");
const OrderItem = require("../models/orderItem.model");
const Order = require("../models/order.model");
const orderItemModel = require("../models/orderItem.model");

exports.createOrder = async(req, res) => {
var i;
console.log(req.body.orderItems.length);
  const userId = req.body.userId;
 // const orderId = req.params.id;
  try {
   // let order = await Order.findOne({ orderId });
   //console.log(order);
for(i=0;i<req.body.orderItems.length;i++){
     const orderItem= new OrderItem({
    userId:req.body.userId,
food:req.body.orderItems[i].food,
supplements:req.body.orderItems[i].supplements,
qte:req.body.orderItems[i].qte,
other:req.body.orderItems[i].other
       });
    /* if (order) {
      //cart exists for user
      let itemIndex = order.orderItems.findIndex(p => p.food == req.body.orderItems[i].food);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = order.orderItems[itemIndex];
        productItem.qte = req.body.orderItems[i].qte;
        order.orderItems[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        order.orderItems.push(orderItem);
      }
      order = await order.save();
      return res.status(201).send(order);
    } else { */
      //no cart for user, create new cart
      const newOrder = await Order.create({
        userId:userId,
        orderItems: req.body.orderItems,
         code: req.body.code,
    delivery: req.body.delivery,
    done: req.body.done,
      });

      return res.status(201).send(newOrder);
    }
//}
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  } 

};

exports.newOrder = async(req, res) => {

  //const userId = req.body.userId;
 const orderId = req.params.id;
  try {
   let order = await Order.findById({_id: orderId });
   console.log(order);
     const orderItem= new OrderItem({
    userId:req.body.userId,
food:req.body.food,
supplements:req.body.supplements,
qte:req.body.qte,
other:req.body.other
       });
    if (order) {
      //cart exists for user
      let itemIndex = order.orderItems.findIndex(p => p.food == req.body.food);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = order.orderItems[itemIndex];
        productItem.qte = req.body.qte;
        order.orderItems[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        order.orderItems.push(orderItem);
      }
      order = await order.save();
      return res.status(201).send(order);
    } else {
      //no cart for user, create new cart
      const newOrder = await Order.create({
        userId:userId,
        orderItems: [orderItem],
         code: req.body.code,
    delivery: req.body.delivery,
    done: req.body.done,
      });

      return res.status(201).send(newOrder);
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  } 

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
    var i;
var orderItem;
    try {
        const order = await Order.findById({ _id: req.params.id })
        console.log(order.orderItems);
        const orderItems = order.orderItems;

        //const orderItem = await orderItems.find({_id:itemId});
       // let orderItem = order.orderItems.find(o => o._id === itemId);
        for(i=0;i<orderItems.length;i++){
            if(orderItems[i]._id==itemId){
                orderItem=orderItems[i];
                console.log(orderItem);
            }
        }
        console.log(orderItem);
        order.orderItems.pull(orderItem);
        await order.save();
        res.status(200).json({ success: true, data: order })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

exports.findOrders = async (req, res) => {
    try {
        const data = await Order.find().
            populate({ path: 'userId', select: 'username' })
            .populate({ path: 'orderItems', populate: { path: 'food', select: 'title price points' } });
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

exports.findOrder = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id).
            populate({ path: 'userId', select: 'username' })
            .populate({ path: 'orderItems', populate: { path: 'food', select: 'title price points' } })
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Order.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Order with id=${id}. Maybe Order was not found!`
                });
            } else res.send({ message: "Order was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Order with id=" + id
            });
        });
};

exports.findOrderByUserID = async (req, res) => {
    const id= req.params.id;
    Order.find({'userId':id})
            .populate({ path: 'orderItems', populate: { path: 'food', select: 'title price points' } })
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
