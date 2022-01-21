const { register, deposit, searchAccounts, transferBy,
  transferTo } = require('../models/account.models');
const { accAlreadyExists, accEntriesValidation, valuesValidate,
  balanceAccountValidation } = require('../utils/validateFunc');

const accountRegister = async ({ fullName, cpf }) => {
  accEntriesValidation(fullName, cpf);
  await accAlreadyExists(cpf);

  const accountID = await register(fullName, cpf);
  return accountID;
};

const getAccountsService = async () => {
  const accounts = await searchAccounts();
  return accounts;
}

const newDepositService = async ({ depositValue, accountDest }) => {
  valuesValidate(depositValue);

  await deposit(depositValue, accountDest);
};

const transferService = async (id, transfValue, accountDest) => {
  await balanceAccountValidation(id, transfValue);
  valuesValidate(transfValue);

  await transferBy(transfValue, id);
  await transferTo(transfValue, accountDest);
};

module.exports = {
  accountRegister,
  newDepositService,
  getAccountsService,
  transferService,
};
