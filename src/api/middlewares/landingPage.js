module.exports = (_req, res, _next) => {
  return res.status(200).send(`
    <body style="text-align: center; margin: 10rem; background-color: rgb(0,0,0);">

      <img width="200px" src="https://media-exp1.licdn.com/dms/image/C4D0BAQEezQzUHoUtcA/company-logo_200_200/0/1625683637278?e=2159024400&v=beta&t=IkDZT_-SGgEJQeHI3Lb7PKhlfqWAoemj56tBrLKFDhw" />

      <h3 style="background-color: orange; width: 80%; text-align: left; padding: 10px">
        Bem vindo ao teste técnico de back-end de
        Gustavo Caruso para a Digital Repúblic
      </h3>

      <p style="background-color: rgb(240, 85, 58); font-size: large; padding: 10px; text-align: left">
          Esse app não possui front-end, por isso para utilizá-lo,
        acesse-o através de um client como 
        <a href="https://insomnia.rest/">Insomnia</a>,
        <a href="https://www.postman.com/">Postman</a>
        ou similar, que é capaz de fazer requisições HTTP sem necessidade de Front.
        <br>
          No client tradicional é possível acessar apenas o endpoint 
          <a href="https://dg-cc-gustacaru.herokuapp.com/accounts">'/accounts'</a> 
        e visualizar todas contas cadastradas
      </p><br><br>

      <span style="font-size: x-large; font-weight: 800;">
          <a style="color: white;  width: 30%" href="https://github.com/gusttavocaruso/donus-cc-gusttavocaruso">
            Acesse AQUI a documentação e tenha mais informações.
          </a>
      </span>

    </body>
  `);
}
