const { Router } = require('express');
const lp = require('../middlewares/landingPage');
const { registerAccount, newDeposit, getAccounts, removeAccount,
  newTransfer } = require('../controllers/account.controllers');

const router = Router();

router.get('/', lp);
router.get('/accounts', getAccounts);
router.post('/register', registerAccount);
router.put('/deposit', newDeposit);
router.put('/transfer/:id', newTransfer);
router.delete('/closure', removeAccount)

module.exports = router;
