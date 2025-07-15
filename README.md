# WebLibrary 📚

Sistema de gerenciamento de biblioteca com funcionalidades como cadastro de acervo, reservas, empréstimos e controle de multas.

---

## 🔧 Tecnologias Utilizadas
- Next JS
- Fastify
- PostgreSQL
- Prisma
- HeroUI

---

## 📁 Estrutura do Projeto
```bash
weblibrary/
├── backend/ # Código da API
├── frontend/ # Interface Web
```


## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL

### 1. Clonar o repositório
```bash
git clone https://github.com/yasminwtr/weblibrary.git
cd weblibrary
```

### 2. Configurar o Back-end
```bash
cd backend
cp .env.example .env
```

Edite o .env com as credenciais do seu banco PostgreSQL.
```bash
# Exemplo de variáveis
DATABASE_URL="postgresql://usuario:senha@localhost:5432/weblibrary"
PORT=3333
```

Instale as dependências e rode as migrations:
```bash
npm install
npx prisma migrate dev
npm run dev
```

### 3. Configurar o Front-end
Abra outro terminal
```bash
cd frontend
cp .env.example .env.local
```

Configure a URL da API no .env.local:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Instale as dependências e inicie o front:
```bash
npm install
npm run dev
```
A aplicação estará disponível em: http://localhost:3001.