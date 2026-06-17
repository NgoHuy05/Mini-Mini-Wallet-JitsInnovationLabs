module.exports.routes = {
  'POST /auth/login': 'AuthController.login',
  'POST /auth/register': 'AuthController.register',

  'POST /pocket/me': 'PocketController.getMyPocket',
  'POST /pocket/balance': 'PocketController.getBalance',
};
