const { Router } = require('express');
const res = require('express/lib/response');
const { registerAccount, newDeposit, getAccounts,
  newTransfer } = require('../controllers/account.controllers');

const router = Router();

router.get('/', getAccounts);
router.post('/register', registerAccount);
router.put('/deposit', newDeposit);
router.put('/transfer/:id', newTransfer);


module.exports = router;
