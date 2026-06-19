const { ObjectId } = require('mongodb');
module.exports = {
  transferMoney: async (req, res) => {
    try {
      const { phone, amount } = req.body;

      if (!phone || !amount || amount <= 0) {
        return res.error(4000); // 4000: 'missing required fields'
      }

      const receiverCustomer = await Customer.findOne({ phone });
      if (!receiverCustomer) {
        return res.error(2004); // 2004: 'receiver not found'
      }

      if (req.user.id === receiverCustomer.id) {
        return res.error(2003); // 2003: 'cannot transfer to yourself'
      }

      const db = sails.getDatastore().manager.collection('pocket');
      const senderObjectId = new ObjectId(req.user.id);
      const receiverObjectId = new ObjectId(receiverCustomer.id);

      const updateBalanceSender = await db.updateOne(
        { owner: senderObjectId, balance: { $gte: amount } },
        { $inc: { balance: -amount } }
      );

      if (updateBalanceSender.modifiedCount === 0) {
        return res.error(2001); // 2001: 'insufficient balance'
      }

      const updateBalanceReceiver = await db.updateOne(
        { owner:receiverObjectId },
        { $inc: { balance: amount } }
      );

      if (updateBalanceReceiver.modifiedCount === 0) {
        await db.updateOne(
          { owner: senderObjectId },
          { $inc: { balance: amount } }
        );
        return res.error(2004); // 2004: 'receiver pocket not found'
      }

      const transaction = await Transaction.create({
        sender: req.user.id,
        receiver: receiverCustomer.id,
        amount,
        status: 'success'
      }).fetch();

      return res.ok(transaction);

    } catch (error) {
      return res.error(500);
    }
  },

  getAllHistoryTransaction: async (req, res) => {
    try {
      const history = await Transaction.find({
        or: [
          { sender: req.user.id },
          { receiver: req.user.id }
        ]
      }).sort('createdAt DESC');

      return res.ok(history);
    } catch (error) {
      return res.error(500);
    }
  },

  getReceivedHistory: async (req, res) => {
    try {
      const history = await Transaction.find({
        receiver: req.user.id
      }).sort('createdAt DESC');

      return res.ok(history);
    } catch (error) {
      return res.error(500);
    }
  },

  getSentHistory: async (req, res) => {
    try {
      const history = await Transaction.find({
        sender: req.user.id
      }).sort('createdAt DESC');

      return res.ok(history);
    } catch (error) {
      return res.error(500);
    }
  },
};
