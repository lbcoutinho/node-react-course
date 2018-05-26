// Middleware function to check if user has enought credits
module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    // 402 = Forbidden
    return res.status(403).send({ error: 'Not enought credits!' });
  }

  // Proceed to next middleware
  next();
};
