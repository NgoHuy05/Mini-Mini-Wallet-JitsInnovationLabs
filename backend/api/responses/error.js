module.exports = function (code) {
  return this.res.status(200).json({
    err: code,
    message: sails.config.respCode[code]
  });
};
