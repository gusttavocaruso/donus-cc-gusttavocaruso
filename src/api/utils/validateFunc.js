const joi = require('@hapi/joi');
const errHandle = require('./errHandle');
const { searchByCpf, searchById } = require('../models/account.models');

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

const DepositValueValidate = (value) => {
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

module.exports = {
  accAlreadyExists,
  accEntriesValidation,
  DepositValueValidate,
  TransfValueValidate,
  balanceAccountValidation,
};
