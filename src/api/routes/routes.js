const { Router } = require('express');
const res = require('express/lib/response');
const { registerAccount, newDeposit, getAccounts,
  newTransfer } = require('../controllers/account.controllers');

const router = Router();

router.get('/', (_req, res, _next) => res.status(200).json({ message: 'hlwrd' }));
router.post('/register', registerAccount);
router.get('/accounts', getAccounts);
router.put('/deposit', newDeposit);
router.put('/transfer/:id', newTransfer);


module.exports = router;
