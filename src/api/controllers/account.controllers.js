const { accountRegister, newDepositService, getAccountsService,
  transferService } = require('../services/account.services');

const registerAccount = async (req, res, next) => {
  try {
    const userData = req.body;
    const accountId = await accountRegister(userData);

    return res.status(201).json({
      message: `Account has been created sucessfuly`,
      accountId })
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const getAccounts = async (_req, res, next) => {
  try {
    const account = await getAccountsService();

    return res.status(200).json(account);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const newDeposit = async (req, res, next) => {
  try {
    const depositData = req.body;
    await newDepositService(depositData);

    const { depositValue: dV } = depositData;
    return res.status(200).json({ message: `Value ${dV} has been deposited`})
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const newTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transfValue, accountDest } = req.body;

    await transferService(id, transfValue, accountDest);

    return res.status(200).json({
      message: `Value ${transfValue} has been transfered to ${accountDest} account`,
    });

  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = {
  registerAccount,
  newDeposit,
  getAccounts,
  newTransfer,
};
