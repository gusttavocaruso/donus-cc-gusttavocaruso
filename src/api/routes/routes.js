const { Router } = require('express');
const { registerAccount, newDeposit, getAccounts,
  newTransfer } = require('../controllers/account.controllers');

const router = Router();

router.post('/register', registerAccount);
router.get('/accounts', getAccounts);
router.put('/deposit', newDeposit);
router.put('/transfer/:id', newTransfer);


module.exports = router;
