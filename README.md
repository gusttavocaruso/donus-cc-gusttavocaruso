<div align="center">

# Desafio de Backend - Digital Republic

Esse repositório contém o código em linguagem Node.js com express, que dá origem a API REST criada por Gustavo Caruso para o teste técnico solicitado pela empresa Digital Republic.

</div>

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

## Para rodar esse projeto na sua máquina:
- é necessário ter suporte para um pacote de dependencias como por exemplo `npm`,
- é necessário ter instalado ou ter um container ativo de `mongodb` e estar com ele ativo.

- você deve clonar o projeto na sua máquina, acessar o diretório e instalar as depêndencias com o comando `npm install`,
- para iniciar o servidor, com a instância do mongodb ativa, rode o comando `npm start`,
- o projeto está rodando na porta :3000 caso queira testar as rotas no client de sua preferência,
- para ter acesso aos testes de integração, rode o comando `npm test`;

#

<div align="center">

# Solicitação do cliente:

Seu objetivo é criar uma API REST com algumas funções essenciais relacionadas ao gerenciamento de contas bancárias;

  Para abrir uma conta é necessário apenas o nome completo e CPF da pessoa, mas só é permitido uma conta por pessoa;

  Com essa conta é possível realizar transferências para outras contas e depositar;

  Não aceitamos valores negativos nas contas;

  Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000;
  
  As transferências entre contas são gratuitas e ilimitadas;

Em relação a banco de dados, quem decide é você mesmo.

</div>
