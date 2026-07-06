module.exports.respCode = {
  // ===== SUCCESS =====
  200: 'success',

  // ===== COMMON ERRORS =====
  400: 'bad request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not found',
  500: 'internal server error',

  // ===== AUTH =====
  1000: 'phone number already exists',
  1001: 'invalid phone or password',
  1002: 'account not found',
  1003: 'password does not match',

  // ===== WALLET =====
  2000: 'wallet not found',
  2001: 'insufficient balance',
  2002: 'invalid amount',
  2003: 'cannot transfer to yourself',
  2004: 'receiver not found',

  // ===== TRANSACTION =====
  3000: 'transaction failed',
  3001: 'transaction not found',

  // ===== VALIDATION =====
  4000: 'missing required fields',
  4001: 'invalid input format'
};
