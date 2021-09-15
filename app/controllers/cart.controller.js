 const cartRepository = require('./repository')
    const productRepository = require('./food.repository.js');
const OrderItem = require("../models/orderItem.model");
const Cart = require("../models/Cart");


    exports.createCart=async(req,res)=>{

          const orderItem= new OrderItem({
    userId:req.body.userId,
food:req.body.food,
supplements:req.body.supplements,
qte:req.body.qte,
other:req.body.other
       });

  const userId = req.params.userId; //TODO: the logged in user id

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.items.findIndex(p => p.food == req.body.food);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.items[itemIndex];
        productItem.qte = req.body.qte;
        cart.items[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.items.push(orderItem);
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        items: [orderItem]
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};


 exports.findCarts = (req, res) => {
    //const userId = req.query.name;
    //var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    Cart.find()
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
    
    exports.addItemToCart = async (req, res) => {
        const {
            food
        } = req.body;
        const qte = Number.parseInt(req.body.qte);
        const userId = req.body.userId;
        try {
            let cart = await cartRepository.cart();
            let productDetails = await productRepository.foodById(food);
                 if (!productDetails) {
                return res.status(500).json({
                    type: "Not Found",
                    msg: "Invalid request"
                })
            }
            //--If Cart Exists ----
            if (cart) {
                //---- check if index exists ----
                const indexFound = cart.items.findIndex(item => item.food.id == food);
                //------this removes an item from the the cart if the qte is set to zero,We can use this method to remove an item from the list  -------
                if (indexFound !== -1 && qte <= 0) {
                    cart.items.splice(indexFound, 1);
                    if (cart.items.length == 0) {
                        cart.subTotal = 0;
                    } else {
                        cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                    }
                }
                //----------check if product exist,just add the previous qte with the new qte and update the total price-------
                else if (indexFound !== -1) {
                    cart.items[indexFound].qte = cart.items[indexFound].qte + qte;
                    cart.items[indexFound].total = cart.items[indexFound].qte * productDetails.price;
                    cart.items[indexFound].price = productDetails.price
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
                //----Check if qte is Greater than 0 then add item to items Array ----
                else if (qte > 0) {
                    cart.items.push({
                        userId:req.body.userId,
food:food,
supplements:req.body.supplements,
qte:req.body.qte,
other:req.body.other
                    })
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
                //----if qte of price is 0 throw the error -------
                else {
                    return res.status(400).json({
                        type: "Invalid",
                        msg: "Invalid request"
                    })
                }
                let data = await cart.save();
                res.status(200).json({
                    type: "success",
                    mgs: "Process Successful",
                    data: data
                })
            }
            //------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
            else {
                const cartData = {
                    items: [{
                        userId:req.body.userId,
food:food,
supplements:req.body.supplements,
qte:req.body.qte,
other:req.body.other
                    }],
                    subTotal: parseInt(productDetails.price * qte)
                }
                cart = await cartRepository.addItem(cartData)
                // let data = await cart.save();
                res.json(cart);
            }
        } catch (err) {
            console.log(err)
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong",
                err: err
            })
        }
    }
  /*  exports.getCart = async (req, res) => {
        const userId=req.body.userId;
        try {
            let cart = await cartRepository.cart(userId)
            if (!cart) {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Cart Not Found",
                })
            }
            res.status(200).json({
                status: true,
                data: cart
            })
        } catch (err) {
            console.log(err)
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong",
                err: err
            })
        }
    }*/
    
    exports.emptyCart = async (req, res) => {
        try {
            let cart = await cartRepository.cart();
            cart.items = [];
            cart.subTotal = 0
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Cart Has been emptied",
                data: data
            })
        } catch (err) {
            console.log(err)
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong",
                err: err
            })
        }
    }

