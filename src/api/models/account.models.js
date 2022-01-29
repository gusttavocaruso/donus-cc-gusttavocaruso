const connect = require('./connection');
const { ObjectId } = require('mongodb');

const register = async (fullName, cpf) => {
  const db = await connect();
  const { insertedId } = await db
    .collection('accounts')
    .insertOne({ fullName, cpf, balance: 0 });
  
  return insertedId;
};

const searchByCpf = async (cpf) => {
  const db = await connect();
  const ussCpf = await db
    .collection('accounts')
    .findOne({ cpf });
  return ussCpf;
};

const searchById = async (id) => {
  const db = await connect();
  const account = await db
    .collection('accounts')
    .findOne({ _id: ObjectId(id) });
  return account;
};

const searchAccounts = async () => {
  const db = await connect();
  const acc = await db
    .collection('accounts')
    .find().toArray();
  return acc;
};

const deposit = async (depositValue, accountDest) => {
  const db = await connect();
  await db.collection('accounts')
    .updateOne(
      { _id: ObjectId(accountDest) },
      { $inc: { balance: depositValue } }
    );
};

const transferTo = async (transfValue, accountDest) => {
  const db = await connect();
  await db.collection('accounts')
    .updateOne(
      { _id: ObjectId(accountDest) },
      { $inc: { balance: transfValue } },
    );
};

const transferBy = async (transfValue, id) => {
  const db = await connect();
  await db.collection('accounts')
    .updateOne(
      { _id: ObjectId(id) },
      { $inc: { balance: -transfValue } },
    );
};

const removeById = async (id) => {
  const db = await connect();
  await db.collection('accounts')
    .deleteOne({ _id: ObjectId(id) });
}

module.exports = {
  register,
  searchByCpf,
  searchAccounts,
  deposit,
  transferTo,
  transferBy,
  searchById,
  removeById,
};
