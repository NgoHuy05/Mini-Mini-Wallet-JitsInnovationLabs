module.exports = {
  transferMoney: async (req, res) => {
    try {
      const { phone, amount } = req.body;

      const senderPocket = await Pocket.findOne({ owner: req.user.id });
      const receiverCustomer = await Customer.findOne({ phone });

      if (!phone || !amount || amount <= 0) {
        return res.error(4000); //   4000: 'missing required fields',
      }

      if (!receiverCustomer) {
        return res.error(2004); //  2004: 'receiver not found',
      }

      if (req.user.id === receiverCustomer.id) {
        return res.error(2003); // 2003: 'cannot transfer to yourself',
      }

      const receiverPocket = await Pocket.findOne({ owner: receiverCustomer.id });

      if (!receiverPocket) {
        return res.error(2004); // 2004 receiver pocket not found
      }

      if (senderPocket.balance < amount) {
        return res.error(2001); // 2001: 'insufficient balance',
      }
      const updatedSender = await Pocket.updateOne({
        id: senderPocket.id,
        balance: { '>=': amount }
      }).set({
        balance: senderPocket.balance - amount
      });

      if (!updatedSender) {
        return res.error(2001);
      }

      const updatedReceiver = await Pocket.updateOne({
        id: receiverPocket.id
      }).set({
        balance: receiverPocket.balance + amount
      });

      if (!updatedReceiver) {
        await Pocket.updateOne({
          id: senderPocket.id
        }).set({
          balance: senderPocket.balance
        });

        return res.error(500);
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
      });

      return res.ok(history);
    } catch (error) {
      return res.error(500);
    }
  },

  getReceivedHistory: async (req, res) => {
    try {
      const history = await Transaction.find({
        receiver: req.user.id
      });

      return res.ok(history);
    } catch (error) {
      return res.error(500);
    }
  },

  getSentHistory: async (req, res) => {
    try {
      const history = await Transaction.find({
        sender: req.user.id
      });

      return res.ok(history);
    } catch (error) {
      return res.error(500);
    }
  },
};