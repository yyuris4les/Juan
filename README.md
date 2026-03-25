# Studio Briefing — Design de Interiores

Formulário completo de briefing com frontend elegante e backend Node.js organizado por camadas.

---

## Estrutura de pastas

```
studio-briefing/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── reset.css           ← Normalização base
│   │   ├── variables.css       ← Tokens de design
│   │   ├── layout.css          ← Estrutura da página
│   │   ├── components.css      ← Inputs, botões, radio, checkbox
│   │   └── animations.css      ← Keyframes e entradas
│   └── js/
│       ├── form.js             ← Validação e coleta
│       ├── api.js              ← Comunicação com backend
│       └── main.js             ← Orquestra o submit
│
├── backend/
│   ├── server.js               ← Entry point
│   ├── package.json
│   ├── .env.example            ← Modelo de variáveis de ambiente
│   ├── routes/
│   │   └── briefings.js        ← Endpoints da API
│   ├── controllers/
│   │   ├── briefingController.js ← Lógica de negócio
│   │   ├── authMiddleware.js     ← Proteção por token
│   │   └── db.js                 ← Acesso ao JSON
│   ├── services/
│   │   └── emailService.js     ← Envio de e-mails (Nodemailer)
│   └── data/
│       └── briefings.json      ← Gerado automaticamente
│
└── README.md
```

---

## Como rodar

### 1. Configurar variáveis de ambiente

```bash
cd backend
cp .env.example .env
# Edite o .env com suas credenciais SMTP
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o servidor

```bash
node server.js
# ou com auto-reload:
npx nodemon server.js
```

Acesse: **http://localhost:3000**

---

## Configuração de E-mail

Edite o arquivo `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua_senha_de_app
ADMIN_EMAIL=seuemail@gmail.com
```

### Gmail — Senha de App

O Gmail exige uma **Senha de App** (não sua senha normal):

1. Acesse: https://myaccount.google.com/apppasswords
2. Ative a verificação em 2 etapas (se ainda não tiver)
3. Crie uma senha de app para "Email"
4. Cole a senha gerada em `SMTP_PASS`

### O que é enviado ao receber um briefing?

| Destinatário | Assunto | Conteúdo |
|---|---|---|
| Admin (`ADMIN_EMAIL`) | `✦ Novo Briefing — Nome do cliente` | Todos os dados do formulário organizados por seção |
| Cliente (`email` do form) | `✦ Recebemos seu briefing, Nome!` | Confirmação com resumo do projeto |

> A falha no envio de e-mail **não impede** o salvamento do briefing — os dados são salvos primeiro e o e-mail é disparado em background.

---

## Endpoints da API

| Método   | Rota                        | Descrição                        | Auth  |
|----------|-----------------------------|----------------------------------|-------|
| `POST`   | `/api/briefing`             | Recebe e salva um novo briefing  | Não   |
| `GET`    | `/api/briefings`            | Lista todos os briefings         | Token |
| `GET`    | `/api/briefings/:id`        | Retorna um briefing por ID       | Token |
| `DELETE` | `/api/briefings/:id`        | Remove um briefing               | Token |

### Autenticação

Passe o token via query string ou header:

```
GET /api/briefings?token=studio2025
# ou
x-admin-token: studio2025
```

Para alterar o token:
```bash
ADMIN_TOKEN=meutoken node server.js
```

---

## Dados salvos

Os briefings ficam em `backend/data/briefings.json`:

```json
[
  {
    "id": "1710000000000",
    "createdAt": "2025-03-25T14:30:00.000Z",
    "nome": "Maria Souza",
    "email": "maria@email.com",
    "telefone": "(71) 98888-0000",
    "endereco": "Av. Oceânica, 500, Salvador",
    "estilo": "contemporâneo minimalista",
    "objetivo": ["estetica", "conforto"]
  }
]
```

---

## Tecnologias

| Camada    | Tecnologia               |
|-----------|--------------------------|
| Frontend  | HTML5, CSS3, JavaScript  |
| Backend   | Node.js + Express        |
| Banco     | JSON local (data/)       |
