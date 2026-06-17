module.exports = function (data) {
  return this.res.status(200).json({
    err: 200,
    message: 'success',
    data: data
  });
};
