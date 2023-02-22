
# SKY-backend

Criar um aplicativo backend que irá expor uma API RESTful de criação de sing up/sign; Esta API ultiliza Rotas Para o CRUD, banco de dados nosql, gera token para autenticação e liberação das rotas, também criptografia de senhas com a biblioteca Bcrypt, ultilizando JavaScript, node.js, Express, Testes Unitários com Jest das funções de Requisição e Utilização de Eslint.

# Observações:

Acredito que não é o correto fazer o commit do .env porém como é apenas um teste para facilitar a validação eu adicionei o .env no commit.


## Autor

- [@Lucas Santos](https://github.com/Lukas656)

## 🛠 Habilidades
node.js, mongoDB, Bcrypt, Express, JWT, Jest 

## Screenshots
![2023-02-15 (7)](https://user-images.githubusercontent.com/72577273/219472066-a4d6686d-14a1-4b09-ad4c-2ac026ac0969.png)


## Documentação
Swagger que subi em um servirdor na AWS pode ser que não fique muito tempo no ar: 
[Documentação](http://ec2-100-26-247-171.compute-1.amazonaws.com:5000/docs/)


## Rodando API

Após clonar o repositório rode os Seguintes comandos
```bash
  npm i
  npm start
```

## POSTMAN

Segue a collection do POSTMAN para facilitar os testes, porém a mesma está configurada com o localhost é necessário alterar o PATCH:

https://api.postman.com/collections/6382000-e0dfbe01-23be-463b-bcff-bfa5cffe4195?access_key=PMAT-01GSTXC45C0XZP8RVBDB9313B2

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test:coverage
  ou
  npm run test
```


