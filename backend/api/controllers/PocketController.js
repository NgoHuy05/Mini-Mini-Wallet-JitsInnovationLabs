module.exports = {
  getMyPocket: async (req, res) => {
    try {
      const pocket = await Pocket.findOne({ owner: req.user.id });
      return res.ok(pocket);
    } catch (error) {
      return res.error(500);
    }
  },

  getBalance: async (req, res) => {
    try {
      const pocket = await Pocket.findOne({ owner: req.user.id });
      return res.ok(pocket.balance);
    } catch (error) {
      return res.error(500);
    }
  }
};
