const joi = require('@hapi/joi');
const errHandle = require('./errHandle');
const { searchByCpf, searchById } = require('../models/account.models');

const accEntriesValidation = (fullName, cpf) => {
  const accSchema = joi.object({
    fullName: joi.string().required(),
    cpf: joi.string().length(11).required(),
  });

  const { error } = accSchema.validate({ fullName, cpf });
  if(error) throw errHandle(400, 'Invalid account entries. Please, try again.');
};

const balanceAccountValidation = async (id, transfValue) => {
  const { balance } = await searchById(id);
  if(balance - transfValue < 0) throw errHandle(400,
    `You can not transfer ${transfValue}. Your account dont have this value`);
};

const accAlreadyExists = async (cpf) => {
  const ussCpf = await searchByCpf(cpf);
  if(ussCpf) throw errHandle(409, 'Cpf already registered');
};

const valuesValidate = (value) => {
  const valueOk = joi.number().min(0).max(2000).required();

  const { error } = valueOk.validate(value);
  if(error) throw errHandle(400, 'Invalid value. Please, set other and try again');
};

module.exports = {
  accAlreadyExists,
  accEntriesValidation,
  valuesValidate,
  balanceAccountValidation,
};
