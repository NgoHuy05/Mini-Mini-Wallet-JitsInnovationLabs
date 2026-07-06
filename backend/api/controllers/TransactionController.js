const { ObjectId } = require('mongodb');
const { client, getDb } = require('../../config/mongoClient');

module.exports = {
  transferMoney: async (req, res) => {
    const session = client.startSession();

    try {
      const { phone, amount } = req.body;
      const amountNum = Number(amount);

      if (!phone || !amountNum || amountNum <= 0) {
        return res.error(4000);
      }

      const receiverCustomer = await Customer.findOne({ phone });
      if (!receiverCustomer) {
        return res.error(2004);
      }

      if (req.user.id === receiverCustomer.id) {
        return res.error(2003);
      }

      const db = getDb();

      const senderId = new ObjectId(req.user.id);
      const receiverId = new ObjectId(receiverCustomer.id);

      let txId;

      await session.withTransaction(async () => {

        const sender = await db.collection('pocket').updateOne(
          { owner: senderId, balance: { $gte: amountNum } },
          { $inc: { balance: -amountNum } },
          { session }
        );

        if (sender.modifiedCount === 0) {
          throw new Error('INSUFFICIENT');
        }

        const receiver = await db.collection('pocket').updateOne(
          { owner: receiverId },
          { $inc: { balance: amountNum } },
          { session }
        );

        if (receiver.modifiedCount === 0) {
          throw new Error('RECEIVER_NOT_FOUND');
        }

        const tx = await db.collection('transaction').insertOne(
          {
            sender: senderId,
            receiver: receiverId,
            amount: amountNum,
            status: 'success',
            createdAt: new Date()
          },
          { session }
        );

        txId = tx.insertedId;
      });

      return res.ok({
        _id: txId,
        amount: amountNum
      });

    } catch (err) {

      if (err.message === 'INSUFFICIENT') {
        return res.error(2001);
      }

      if (err.message === 'RECEIVER_NOT_FOUND') {
        return res.error(2004);
      }

      return res.error(500);

    } finally {
      await session.endSession();
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
