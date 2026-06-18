const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.error(403);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, sails.config.custom.ACCESS_TOKEN_SECRET);

    req.user = decoded;

    return proceed();
  } catch (err) {
    console.log(err);
    return res.error(403);
  }
};
