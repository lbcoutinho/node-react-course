const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  // Route add 'requireLogin' middleware to the chain
  app.post('/api/stripe', requireLogin, async (req, res) => {
    // Send charge to stripe
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });

    // Add credits to user account
    req.user.credits += 5;
    const user = await req.user.save();

    // Send back updated user
    res.send(user);
  });
};
