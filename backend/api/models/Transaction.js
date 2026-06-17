module.exports = {
  attributes: {
    amount: {
      type: 'number',
      required: true,
    },
    sender: {
      model: 'customer',
      required: true,
    },
    receiver: {
      model: 'customer',
      required: true,
    },
    status: {
      type: 'string',
      isIn: ['success', 'failed'],
      defaultsTo: 'success',
    }
  }
};
