const { register, deposit, searchAccounts, transferBy,
  transferTo } = require('../models/account.models');
const { accAlreadyExists, accEntriesValidation, DepositEntriesValidate,
  balanceAccountValidation, TransfValueValidate } = require('../utils/validateFunc');

const accountRegister = async ({ fullName, cpf }) => {
  accEntriesValidation(fullName, cpf);
  await accAlreadyExists(cpf);

  const accountID = await register(fullName, cpf);
  return accountID;
};

const getAccountsService = async () => {
  const accounts = await searchAccounts();
  const accNumberField = accounts
    .map(({ _id, fullName, cpf, balance }) => (
      { accountNumber: _id, fullName, cpf, balance }
    ));
  return accNumberField;
}

const newDepositService = async ({ depositValue, accountDest }) => {
  DepositEntriesValidate(depositValue, accountDest);

  await deposit(depositValue, accountDest);
};

const transferService = async (id, transfValue, accountDest) => {
  await balanceAccountValidation(id, transfValue);
  TransfValueValidate(transfValue);

  await transferBy(transfValue, id);
  await transferTo(transfValue, accountDest);
};

module.exports = {
  accountRegister,
  newDepositService,
  getAccountsService,
  transferService,
};
