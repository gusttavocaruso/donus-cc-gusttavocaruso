const joi = require('@hapi/joi');
const errHandle = require('./errHandle');
const { searchByCpf, searchById } = require('../models/account.models');

const validAccountId = (id) => {
  const idOk = joi.string().length(24).required();
  const { error } = idOk.validate(id);
  return error;
}

const accEntriesValidation = (fullName, cpf) => {
  const accSchema = joi.object({
    fullName: joi.string().required(),
    cpf: joi.string().length(11).required(),
  });

  const { error } = accSchema.validate({ fullName, cpf });
  if(error) throw errHandle(401,
      'You\'ve set "name" or "cpf" incorrectly. Please, try again.');
};

const balanceAccountValidation = async (id, transfValue) => {
  const { balance } = await searchById(id);
  if(balance - transfValue < 0) throw errHandle(400,
    `You could not transfer ${transfValue}. Your account dont have this value`);
};

const accAlreadyExists = async (cpf) => {
  const ussCpf = await searchByCpf(cpf);
  if(ussCpf) throw errHandle(409, 'Cpf already registered');
};

const DepositEntriesValidate = async (value, accountDest) => {
  if(!value) throw errHandle(400, 'depositValue must be informed');
  if(!accountDest) throw errHandle(400, 'accountDest must be informed');

  const erro = validAccountId(accountDest);
  if(erro) throw errHandle(400, 'accountDest must be a valid account number');

  const account = await searchById(accountDest);
  if(!account) throw errHandle(400, 'You must set a exist account number.');

  const valueOk = joi.number().min(0).max(2000).required();
  const { error } = valueOk.validate(value);
  if(error) throw errHandle(400,
    `It is an invalid value to deposit. Only number-values under 2000 is allowed`);
};

const TransfValueValidate = (value) => {
  const valueOk = joi.number().min(0).required();

  const { error } = valueOk.validate(value);
  if(error) throw errHandle(400, 'Invalid amount. Only positive-values must be transfer');
};

const accountOrigValidate = async (accountOrig) => {
  if(!accountOrig) throw errHandle(400, 'You must set a account number');
  
  const error = validAccountId(accountOrig);
  if(error) throw errHandle(400, 'You must set a valid account origin number');

  const accountExists = await searchById(accountOrig);
  if(!accountExists) throw errHandle(400, 'You must set a exists account origin number');
};

const accountDestValidate = async (accountDest) => {
  if(!accountDest) throw errHandle(400, 'You must set a account number');
  
  const error = validAccountId(accountDest);
  if(error) throw errHandle(400, 'You must set a valid account destiny number');

  const accountExists = await searchById(accountDest);
  if(!accountExists) throw errHandle(400, 'You must set a exists account destiny number');
};

const shuttingDownValidate = async (id) => {
  if(!id) throw errHandle(400, 'You must set a account number');

  const error = validAccountId(id);
  if(error) throw errHandle(400, 'You must set a valid account number');

  const account = await searchById(id);
  if(!account) throw errHandle(400, 'You must set a exist account number.');

  if(account.balance > 0) throw errHandle(400,
    `You can not closure this account because there are ${account.balance}. Please, remove it all first`)
};

module.exports = {
  accAlreadyExists,
  accEntriesValidation,
  DepositEntriesValidate,
  TransfValueValidate,
  balanceAccountValidation,
  accountOrigValidate,
  accountDestValidate,
  shuttingDownValidate,
};
