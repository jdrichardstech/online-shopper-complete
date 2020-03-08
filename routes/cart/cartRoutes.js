const router = require('express').Router();
const Cart = require('./models/Cart');

const stripe = require('stripe')(process.env.STRIPE_SK);

router.post('/payment', (req, res, next) => {
  Cart.findOne({ owner: req.user._id }).then(cart => {
    let amount = Math.ceil((cart.total + 5.99) * 100);
    stripe.customers
      .create({
        email: req.body.email,
        card: req.body.id
      })
      .then(customer => {
        let result = stripe.charges.create({
          amount,
          description: 'Online Shopping Charge',
          currency: 'usd',
          customer: customer.id
        });
        return result;
      })
      .then(() => {
        let user = req.user;

        for (let order of cart.items) {
          user.history.push({
            item: order.item,
            paid: order.price
          });
        }
        user.save();
      })
      .then(result => {
        cart.items = [];
        cart.total = 0;
        cart.save();
      })

      .catch(err => {
        console.log('Error:', err);
        return res.status(500).send({ error: 'Purchase Failed' });
      });
  });
});

router.get('/', (req, res, next) => {
  Cart.findOne({ owner: req.user._id })
    .populate('items.item')
    .exec((err, foundCart) => {
      if (err) return next(err);
      res.render('main/cart', {
        foundCart: foundCart,
        message: req.flash('remove')
      });
    });
});

router.post('/product/remove', (req, res, next) => {
  Cart.findOne({ owner: req.user._id }).then(cart => {
    cart.items.pull(String(req.body.item));
    cart.total = (cart.total - parseFloat(req.body.price)).toFixed(2);
    cart
      .save()
      .then(cart => {
        req.flash('remove', 'Successfully removed');
        return res.redirect('/api/cart');
      })
      .catch(err => next(err));
  });
});

router.post('/:product_id', (req, res, next) => {
  Cart.findOne({ owner: req.user._id }, (err, cart) => {
    if (err) return next(err);

    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    });
    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
    cart
      .save()
      .then(cart => {
        return res.redirect('/api/cart');
      })
      .catch(err => next(err));
  });
});

module.exports = router;
