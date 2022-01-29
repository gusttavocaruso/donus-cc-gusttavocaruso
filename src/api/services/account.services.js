const { register, deposit, searchAccounts, transferBy,
  transferTo, removeById } = require('../models/account.models');
const { accAlreadyExists, accEntriesValidation, DepositEntriesValidate, accountOrigValidate,
  balanceAccountValidation, TransfValueValidate, accountDestValidate, shuttingDownValidate,
} = require('../utils/validateFunc');

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

const transferService = async (accountOrig, transfValue, accountDest) => {
  await accountOrigValidate(accountOrig);
  await accountDestValidate(accountDest);
  await balanceAccountValidation(accountOrig, transfValue);
  TransfValueValidate(transfValue);

  await transferBy(transfValue, accountOrig);
  await transferTo(transfValue, accountDest);
};

const removeService = async (id) => {
  await shuttingDownValidate(id);
  await removeById(id);
};

module.exports = {
  accountRegister,
  newDepositService,
  getAccountsService,
  transferService,
  removeService,
};
