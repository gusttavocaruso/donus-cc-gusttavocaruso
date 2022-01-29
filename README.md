<div align="center">

# Code Challenge Backend - Digital Republic
  
  <img width="100px" src="https://media-exp1.licdn.com/dms/image/C4D0BAQEezQzUHoUtcA/company-logo_200_200/0/1625683637278?e=2159024400&v=beta&t=IkDZT_-SGgEJQeHI3Lb7PKhlfqWAoemj56tBrLKFDhw" />

Esse repositório contém o código em linguagem Node.js com express e mongodb, que dá origem a API REST criada por Gustavo Caruso para o teste técnico solicitado pela empresa Digital Republic.

</div>

#

## Informações para consumo da API:

Esse projeto esta hospedado na plataforma <a href="https://www.heroku.com/" target="_blank">HEROKU</a> e pode ser acessado através <a href="https://dg-cc-gustacaru.herokuapp.com/" target="_blank">DESTE LINK</a>

O Banco de dados utilizado é o <a target="_blank" href="https://www.mongodb.com/">MongoDB</a> e está hospedado no <a target="_blank" href="https://cloud.mongodb.com/">MongoCloud Atlas</a>

Esse projeto não tem front-end, por isso, para acessar todas as rotas utilize um client como 
<a target="_blank" href="https://insomnia.rest/">Insomnia</a>, <a target="_blank" href="https://www.postman.com/">Postman</a> ou similar.

As rotas disponíveis são: /accounts, /register, /deposit, /transfer/:id e /closure

###  1. https://dg-cc-gustacaru.herokuapp.com/accounts - requisição HTTP: `GET` <br>
  Essa rota retorna as contas registradas no banco de dados e exibe um array de objetos em um formato como:

  ```json
    [
      {
        "accountNumber": "_id",
        "fullName": "string",
        "cpf": "string",
        "balance": 0,
      }
    ]
  ```

###  2. https://dg-cc-gustacaru.herokuapp.com/register - requisição HTTP: `POST` <br>
  Essa rota 'abre uma nova conta'. Ela deve recer um JSON no formato:

  ```json
    {
      "fullName": "Nome do Titular da Conta",
      "cpf": "número do cpf" 
    }
  ```
  - ambos os campos devem ser strings;
  - ambos os campos são obrigatórios;
  - o campo "cpf" deve ter 11 caracteres e ser único; 
  <br><br>

###  3. https://dg-cc-gustacaru.herokuapp.com/deposit - requisição HTTP: `PUT` <br>
  Essa rota cria um novo depósito em uma conta já existente e deve receber um JSON no formato:

  ```json
    {
      "depositValue": 999,
      "accountDest": "61f08fa4aaa9a0355ff86d90"
    }
  ```
  - ambos os campos são obrigatórios;
  - o campo "depositValue" deve receber o valor em formato númerico que se deseja transferir e somente aceita valores `x`, sendo: `0 < x <= 2000`;
  - o campo "accountDest" deve receber um "accountNumber" **válido e cadastrado**, correspondente a conta que receberá o deposito. Os accountNumbers disponíveis podem ser encontrados na rota `/account`;
  <br><br>


###  4. https://dg-cc-gustacaru.herokuapp.com/transfer/:id - requisição HTTP: `PUT` <br>
  Essa rota possibilita a transferencia de valores entre contas existentes. <br>
    A rota deve ser acessada substituindo o campo `/:id` da rota com o valor da "accountNumber" correspondente a conta que esta **transferindo para**. <br>
    Ela deve receber um JSON no formato:

  ```json
    {
      "transfValue": 999,
      "accountDest": "61f08fd4aaa9a0355ff86d91"
    }
  ```
  - ambos os campos são obrigatórios;
  - o campo "transfValue" deve receber valores númericos > 0;
  - o campo "transfValue" deve ser MAIOR que o valor "balance" da conta referenciada na rota no campo "/:id";
  - o campo "accountDest" deve receber o "accountNumber" correspondente a conta que receberá a transferência. Os accountNumbers disponíveis podem ser encontrados na rota `/account`;
  <br><br>

### 5. https://dg-cc-gustacaru.herokuapp.com/closure - requisição HTTP: `DELETE` <br>
  Essa rota possibilita o encerramento de uma conta. A conta só pode ser encerrada **se ela tiver sem saldo**. <br>
  Ela deve receber um JSON no formato:

  ```json
    {
      "accountNumber": "61f45d838b82b198b55ebe6a"
    }
  ```
  - o campo "accountNumber" é obrigatório;
  - para ser removida com sucesso, a conta referenciada na "accountNumber" deve ter o valor "balance" = 0;

#

## Informações de desenvolvimento:

Esse projeto utiliza as depêndencias diretas:
- `express` - framework para construção de servidores web e requisições HTTP,
- `mongodb` - banco de dados noSQL,
- `@hapi/joi` - lib de validação de dados;

e também, as depêndencias de desenvolvimento:
- `nodemon` - lib p/ exercutar servidor ininterruptamente ,
- `mocha` - lib p/ teste,
- `chai` - lib p/ teste,
- `chai-http` - lib p/ teste,
- `sinon` - lib p/ teste,
- `mongodb-memory-server@6` - lib que simula banco de dados p/ teste;

### Para rodar esse projeto na sua máquina:
- Clone esse repositório para sua máquina e instale as dependencias com um gerenciador de pacotes de sua escolha - `npm`, `yarn`;

- Instale o banco de dados `mongodb` OU rode um container com sua imagem com docker.

- Para iniciar o servidor rode o comando `npm start` ou `npm run dev`. Ele rodará na porta :3000;

- O projeto esta coberto por +40 testes de validação dos dados recebidos. Para ter acesso aos testes, verifique a pasta `./src/tests` ou rode o comando `npm test`;

#

<div align="left">

## Solicitação do cliente:

Seu objetivo é criar uma API REST com algumas funções essenciais relacionadas ao gerenciamento de contas bancárias;

  - Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa;

  - Com essa conta é possível realizar transferências para outras contas e depositar;

  - Não aceitamos valores negativos nas contas;

  - Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000;
  
  - As transferências entre contas são gratuitas e ilimitadas;

  - Em relação a banco de dados, quem decide é você mesmo.

</div>
