module.exports = (_req, res, _next) => {
  return res.status(200).send(`
    <body style="text-align: center; margin: 6rem">
      <h3>
        Bem vindo ao teste técnico de criação de APIRest de 
        Gustavo Caruso para a Digital Repúblic
      </h3>

      <p>
          Esse app não possui front-end, por isso para utilizá-lo,
        acesse-o através de um client como Insomnia ou Postman que
        é capaz de fazer requisições HTTP sem necessidade de Front.
        <br>
          No client tradicional é possível acessar apenas a rota '/accounts' 
        e visualizar todas contas cadastradas
      </p><br><br>

      <span style="font-size: large; font-weight: 800">
          <a href="https://github.com/gusttavocaruso/donus-cc-gusttavocaruso">
            Acesse a documentação AQUI e veja mais informações de utilização.
          </a>
      </span>
    </body>
  `);
}
