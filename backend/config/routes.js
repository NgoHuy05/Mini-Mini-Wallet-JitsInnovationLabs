module.exports.routes = {
  'POST /auth/login': 'AuthController.login',
  'POST /auth/register': 'AuthController.register',

  'POST /pocket/me': 'PocketController.getMyPocket',
  'POST /pocket/balance': 'PocketController.getBalance',

  'POST /transaction/tranfer': 'TransactionController.transferMoney',
  'POST /transaction/all-history': 'TransactionController.getAllHistoryTransaction',
  'POST /transaction/received-history': 'TransactionController.getReceivedHistory',
  'POST /transaction/sent-history': 'TransactionController.getSentHistory',
};
