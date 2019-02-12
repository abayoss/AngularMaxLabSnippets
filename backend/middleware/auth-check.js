const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,"secret_chould_be_longer");
    next();
  } catch(error) {
    res.status(200).json({ message: "auth failed" });
  }
}
