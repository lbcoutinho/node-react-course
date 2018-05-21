// Middleware function to check if user is authenticated
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  // Proceed to next middleware
  next();
};
