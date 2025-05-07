# 🧠 90+ – A Web3 Betting Platform

**90+** is a decentralized web application that allows users to place bets on live events using cryptocurrency. Built with modern full-stack technologies and Drizzle ORM for database management.

---

## 🚀 Features

- 📊 Real-time betting odds
- 🔐 Wallet-based authentication (e.g., Web3Auth, Phantom, etc)
- 💰 Cryptocurrency-based bets
- 📈 Drizzle ORM for schema-safe SQL
- 🛠️ Type-safe API with tRPC

---

## 🛠️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/prince-hope1975/90-.git 90plus
cd 90plus
```

### 2. Install all dependencies

```bash
pnpm install
```

### 3. Create your .env 
Copy the details on the env.template file and place it on your own .env file

### 4. Generate the drizzle client and push to database

```bash
pnpm db:generate
pnpm db:push
```

### 5. Take a look at the SOLANO_WALLET_README.md for more details on the web3 aspect

### 6. Run the application

```bash
pnpm dev
```

