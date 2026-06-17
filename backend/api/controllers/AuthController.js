const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res) => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.error(4000);
      }

      const user = await Customer.findOne({ phone });

      if (!user) {
        return res.error(1002);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.error(1001);
      }

      delete user.password;

      return res.ok(user);
    } catch (error) {
      return res.error(500);
    }
  },

  register: async (req, res) => {
    try {
      const { phone, password, repassword } = req.body;

      if (!phone || !password || !repassword) {
        return res.error(4001);
      }

      const existed = await Customer.findOne({ phone });

      if (existed) {
        return res.error(1000);
      }

      if (password !== repassword) {
        return res.error(1003);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await Customer.create({
        phone,
        password: hashedPassword,
      }).fetch();

      delete user.password;

      return res.ok(user);
    } catch (error) {
      return res.error(500);
    }
  }
};