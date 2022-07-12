<p align="center">

  <h1 align="center">
    valex-api
  </h1>
</p>

## Usage

```bash
$ git clone https://github.com/pablodamascenoo/valex-api.git

$ cd valex-api

$ npm install

$ npm run dev
```

API:

```
- POST /cards/create
    - Rota para criar novos cartões
    - headers: {}
    - body: {
        "employeeId": 1,
        "type": "groceries",
    }

- PUT /cards/activate
    - Rota para cadastrar senha e ativar o cartão
    - headers: {}
    - body: {
        "cardId": 1,
        "secutiryCode": "123",
        "password": "1234"
    }

- GET /cards/:cardId/balance
    - Rota para listar o saldo e transações do cartão pelo id do cartão
    - headers: {}
    - body: {}

- PUT /cards/lock
    - Rota para bloquear um cartão
    - headers: {}
    - body: {
        "cardId": 1,
        "password": "1234"
    }

- PUT /cards/lock
    - Rota para desbloquear um cartão
    - headers: {}
    - body: {
        "cardId": 1,
        "password": "1234"
    }

- POST /cards/payment
    - Rota para deletar um usuário pelo id
    - headers: {}
    - body: {
        "cardId": 1,
        "password": "1234",
        "businessId": 1,
        "amount": 1000
    }

- POST /cards/recharge
    - Rota para deletar um usuário pelo id
    - headers: {}
    - body: {
        "cardId": 1,
        "amount": 1000
    }
```
