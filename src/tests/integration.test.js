const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../api/server');
const mongodb = require('mongodb').MongoClient;
const { getConnection } = require('./connectionMock');

chai.use(chaiHttp);
const { expect } = chai;


let connectionMock;
before(async () => {
  connectionMock = await getConnection();
  sinon.stub(mongodb, 'connect').resolves(connectionMock);
});
after(() => { mongodb.connect.restore() });


describe('1 - fullName e cpf são obrigatórios para abrir uma conta: ', () => {
  let response;

  describe('Testa quando não é informado um fullName', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/register')
        .send({ cpf: '12345678911' });
    });
  
    it('Deve retornar o status 401', () => {
      expect(response).to.have.status(401);
    });
  
    it('A requisição deve retornar a mensagem: You\'ve set "name" or "cpf" incorrectly. Please, try again.', () => {
      expect(response.body.message).to.be
        .equals('You\'ve set "name" or "cpf" incorrectly. Please, try again.');
    })

  });

  describe('Testa quando é informado um formato inválido de fullName', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/register')
        .send({ fullName: 007, cpf: '12345678911' });
    });
  
    it('Deve retornar o status 401', () => {
      expect(response).to.have.status(401);
    });
  
    it('A requisição deve retornar a mensagem: You\'ve set "name" or "cpf" incorrectly. Please, try again.', () => {
      expect(response.body.message).to.be
        .equals('You\'ve set "name" or "cpf" incorrectly. Please, try again.');
    })

  });

  describe('Testa quando não é informado um cpf', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/register')
        .send({ fullName: 'Leandro Karnal' });
    });
  
    it('Deve retornar o status 401', () => {
      expect(response).to.have.status(401);
    });
  
    it('A requisição deve retornar a mensagem: You\'ve set "name" or "cpf" incorrectly. Please, try again.', () => {
      expect(response.body.message).to.be
        .equals('You\'ve set "name" or "cpf" incorrectly. Please, try again.');
    })

  });

  describe('Testa quando é informado um formato inválido de cpf', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/register')
        .send({ fullName: 'Mano Brown', cpf: 12345678911 });
    });
  
    it('Deve retornar o status 401', () => {
      expect(response).to.have.status(401);
    });
  
    it('A requisição deve retornar a mensagem: You\'ve set "name" or "cpf" incorrectly. Please, try again.', () => {
      expect(response.body.message).to.be
        .equals('You\'ve set "name" or "cpf" incorrectly. Please, try again.');
    })

  });

  describe('Testa quando são informados fullName e cpf em formatos válidos', () => {

    before(async () => {
      response = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Mano Brown',
          cpf: '98765432155'
        });
    });

    it('Deve retornar o status 201', () => {
      expect(response).to.have.status(201);
    })

    it('A requisição deve retornar a mensagem: Account has been created sucessfuly', () => {
      expect(response.body.message).to.be.equals('Account has been created sucessfuly');
    })

  })

});


describe('2 - Só é permitido uma conta por pessoa', () => {
  let response;

  describe('Testa quando um novo cpf tenta criar uma conta', () => {
    before(async () => {
      response = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Criolo',
          cpf: '98765432171'
        });
    });

    it('Deve retornar o status 201', () => {
      expect(response).to.have.status(201);
    })

    it('A requisição deve retornar a mensagem: Account has been created sucessfuly', () => {
      expect(response.body.message).to.be.equals('Account has been created sucessfuly');
    })
  })

  describe('Testa quando um cpf já registrado tenta criar uma conta', () => {

    before(async () => {
      const accountsMock = connectionMock
        .db('account_management').collection('accounts');
  
      await accountsMock.insertOne({
        fullName: 'Sabotage',
        cpf: '01234567891'
      })
  
      response = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Sabotage',
          cpf: '01234567891'
        });
    });
  
    it('Deve retornar o status 409', () => {
      expect(response).to.have.status(409);
    })
  
    it('A requisição deve retornar a mensagem: Cpf already registered', () => {
      expect(response.body.message).to.be.equals('Cpf already registered');
    })

  });

});


describe('3 - É possível realizar depositos na conta. Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000', () => {
  let response;

  describe('Testa quando é realizado um depósito de até R$2.000', () => {
    before(async () => {
      const accountMock = await chai.request(server)
      .post('/register')
      .send({
        fullName: 'L. F. Pondé',
        cpf: '01234567800',
      });
  
      response = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 2000,
          accountDest: accountMock.body.accountNumber,
        });
    });
  
    it('Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    })

    it('A requisição deve retornar a mensagem: `Value "depositValue" has been deposited`', () => {
      expect(response.body.message).to.contains(`has been deposited`)
    })
  })

  describe('Testa quando é realizado um depósito > R$2.000', () => {

    before(async () => {
      const accountMock = await chai.request(server)
      .post('/register')
      .send({
        fullName: 'M. S. Cortela',
        cpf: '01234567899',
      });
  
      response = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 2001,
          accountDest: accountMock.body.accountNumber,
        });
    });
  
    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: `It is an invalid value to deposit. Only number-values under 2000 is allowed`', () => {
      expect(response.body.message).to.be.equals(`It is an invalid value to deposit. Only number-values under 2000 is allowed`);
    })

  })

  describe('Testa quando não é informado um valor para depósito', () => {

    before(async () => {
      const accountMock = await chai.request(server)
      .post('/register')
      .send({
        fullName: 'L. F. Pondé',
        cpf: '01234567800',
      });
  
      response = await chai.request(server)
        .put('/deposit')
        .send({
          accountDest: accountMock.body.accountNumber,
        });
    });
  
    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: depositValue must be informed', () => {
      expect(response.body.message).to.be.equals('depositValue must be informed')
    })

  })

  describe('Testa quando não é informado uma conta para depósito', () => {

    before(async () => {
      const accountMock = await chai.request(server)
      .post('/register')
      .send({
        fullName: 'M. S. Cortela',
        cpf: '01234567899',
      });
  
      response = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 2001,
          accountDest: accountMock.body.accountNumber,
        });
    });
  
    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: accountDest must be informed', () => {
      expect(response.body.message).to.be.equals('accountDest must be informed')
    })

  })

});


describe('4 - É possível realizar transferências gratuitas e ilimitadas entre contas, porém, elas não devem ficar com valores negativos', () => {
  let response;

  describe('Testa quando é realizado uma transferência válida', () => {

    before(async () => {
      const accountMock1 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Thiago Nigro',
          cpf: '96385274128',
        });

      const accountMock2 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Clóvis de Barros F.',
          cpf: '14785236973',
        });

      const depositMock = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 2000,
          accountDest: accountMock1.body.accountNumber,
        });

      response = await chai.request(server)
      .put(`/transfer/${accountMock1.body.accountNumber}`)
      .send({
        transfValue: 2000,
        accountDest: accountMock2.body.accountNumber,
      })

    });

    it('Deve retornar o status 200', () => {
      expect(response).to.have.status(200);
    })

    it('A requisição deve retornar a mensagem: `Value "transfValue" has been transfered to "accountDest" account`', () => {
      expect(response.body.message).to.contains(`has been transfered to`);
    })

  })

  describe('Testa quando é realizado uma transferência com valor maior do que tem na conta', () => {
    before(async () => {
      const accountMock1 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Joey Tribbiani',
          cpf: '96385274281',
        });

      const accountMock2 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Chandler Bing',
          cpf: '14785236993',
        });

      const depositMock = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 10,
          accountDest: accountMock1.body.accountNumber,
        });

      response = await chai.request(server)
      .put(`/transfer/${accountMock1.body.accountNumber}`)
      .send({
        transfValue: 10.5,
        accountDest: accountMock2.body.accountNumber,
      })

    });

    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: `You could not transfer "transfValue". Your account dont have this value`', () => {
      expect(response.body.message).to.contains(`Your account dont have this value`);
    })

  })

  describe('Testa quando tenta realizar uma transferencia sem um numero de conta de origem válido', () => {

    before(async () => {
      const accountMock1 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Joey Tribbiani',
          cpf: '96385274381',
        });

      const accountMock2 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Chandler Bing',
          cpf: '14785236493',
        });

      const depositMock = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 10,
          accountDest: accountMock1.body.accountNumber,
        });

      response = await chai.request(server)
      .put(`/transfer/999`)
      .send({
        transfValue: 5,
        accountDest: accountMock2.body.accountNumber,
      })

    });

    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: You must set a valid account origin number', () => {
      expect(response.body.message).to.be.equals('You must set a valid account origin number');
    })

  })

  describe('Testa quando tenta realizar uma transferencia com um numero de conta de origem que não está cadastrado', () => {

    before(async () => {
      const accountMock1 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Joey Tribbiani',
          cpf: '96385274381',
        });

      const accountMock2 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Chandler Bing',
          cpf: '14785236493',
        });

      const depositMock = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 10,
          accountDest: accountMock1.body.accountNumber,
        });

      response = await chai.request(server)
      .put(`/transfer/123456789012345678901234`)
      .send({
        transfValue: 5,
        accountDest: accountMock2.body.accountNumber,
      })

    });

    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: You must set a exists account origin number', () => {
      expect(response.body.message).to.be.equals('You must set a exists account origin number');
    })

  })

  describe('Testa quando é realizado uma transferência sem um número de conta de destino válido', () => {

    before(async () => {
      const accountMock1 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Thiago Nigro',
          cpf: '16385274128',
        });

      const accountMock2 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Clóvis de Barros F.',
          cpf: '24785236973',
        });

      const depositMock = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 2000,
          accountDest: accountMock1.body.accountNumber,
        });

      response = await chai.request(server)
      .put(`/transfer/${accountMock1.body.accountNumber}`)
      .send({
        transfValue: 2000,
        accountDest: '999',
      })

    });

    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: You must set a valid account destiny number', () => {
      expect(response.body.message).to.be.equals('You must set a valid account destiny number');
    })

  })

  describe('Testa quando é realizado uma transferência com número de conta de destino não cadastrado', () => {

    before(async () => {
      const accountMock1 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Thiago Nigro',
          cpf: '96385264128',
        });

      const accountMock2 = await chai.request(server)
        .post('/register')
        .send({
          fullName: 'Clóvis de Barros F.',
          cpf: '13785236973',
        });

      const depositMock = await chai.request(server)
        .put('/deposit')
        .send({
          depositValue: 2000,
          accountDest: accountMock1.body.accountNumber,
        });

      response = await chai.request(server)
      .put(`/transfer/${accountMock1.body.accountNumber}`)
      .send({
        transfValue: 2000,
        accountDest: '123456789012345678901234',
      })

    });

    it('Deve retornar o status 400', () => {
      expect(response).to.have.status(400);
    })

    it('A requisição deve retornar a mensagem: You must set a exists account destiny number', () => {
      expect(response.body.message).to.be.equals('You must set a exists account destiny number');
    })

  })

});
