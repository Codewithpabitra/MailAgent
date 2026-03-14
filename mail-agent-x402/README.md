# MailMind — AI-Powered Mailing Agent with x402 Payments

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Solidity-0.8.20-blue?style=for-the-badge&logo=solidity" />
  <img src="https://img.shields.io/badge/LLaMA-3.3--70b-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/x402-Payment%20Protocol-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Base-Sepolia%20Testnet-0052FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## Demo Video - https://youtu.be/pMtfQQ5U0Hk

## What is MailMind?

**MailMind** is an AI-powered mailing agent that reads a list of recipients from a CSV file and automatically generates a unique, personalized email for each recipient using the **LLaMA 3.3-70b** model (via Groq). Each email generation is gated behind a **x402 payment flow** — meaning the agent must pay a small fee per email before the server generates and sends it.

This project demonstrates the integration of:
- **AI-generated dynamic content** (personalized emails per recipient)
- **x402 payment protocol** (HTTP 402 Payment Required flow)
- **Smart contracts on blockchain** (on-chain payment logging)
- **Automated email delivery** (via Nodemailer + Gmail SMTP)

Built for the **Vibe-A-Thon Hackathon** — a 4-hour build event focused on x402-powered agents.

---

## How It Works

```
CSV File (recipients)
       │
       ▼
  Agent (agent.js)
  reads each row
       │
       ▼
  POST /pay  ──────────────► Express Server (server.js)
  (pay per email)                   │
       │                            │ returns payment token
       ▼                            ▼
  POST /send-email ◄──── x402 middleware checks token
  with payment token                │
                                    │ if valid
                                    ▼
                          LLaMA 3.3 (via Groq API)
                          generates personalized email
                                    │
                                    ▼
                          Nodemailer sends email via Gmail
                                    │
                                    ▼
                          Smart Contract logs payment
                          on Base Sepolia blockchain
```

**In simple terms:**
1. The agent reads each row from your CSV
2. For each recipient, it first pays the server (x402 flow)
3. The server returns a one-time payment token
4. The agent sends the token with the email request
5. The server verifies the token, generates a personalized email using LLaMA AI, and sends it
6. The payment is logged on the blockchain via a Solidity smart contract

---

## Features

- **Dynamic email generation** — every email is uniquely written by LLaMA 3.3-70b based on recipient's name, company, and role
- **x402 payment protocol** — HTTP 402 Payment Required flow, charge per email generated
- **Smart contract** — on-chain payment logging with `payForEmail()` function on Base Sepolia
- **CSV-driven** — just update your CSV and run; no code changes needed
- **Bulk sending** — processes all recipients sequentially with rate limiting
- **CLI-based** — no UI needed, runs entirely in the terminal

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| AI Model | LLaMA 3.3-70b via Groq SDK |
| Payment Protocol | x402 (HTTP 402 flow) |
| Smart Contract | Solidity 0.8.20 |
| Blockchain | Base Sepolia Testnet |
| Contract Framework | Hardhat 2 |
| Email Delivery | Nodemailer + Gmail SMTP |
| Web Server | Express.js |
| CSV Parsing | csv-parser |

---

## Project Structure

```
mail-agent-x402/
│
├── contracts/
│   └── MailPayment.sol        # Solidity smart contract — logs payments on-chain
│
├── scripts/
│   └── deploy.js              # Hardhat deploy script for Base Sepolia
│
├── ignition/modules/          # Hardhat ignition (auto-generated)
│
├── test/                      # Contract test files
│
├── artifacts/                 # Compiled contract artifacts (auto-generated)
├── cache/                     # Hardhat cache (auto-generated)
├── node_modules/              # npm dependencies (auto-generated)
│
├── agent.js                   # Main mailing agent — reads CSV and triggers payments
├── server.js                  # Express server with x402 middleware + email sending
├── recipients.csv             # Input file — list of email recipients
│
├── .env                       # Environment variables (never commit this!)
├── .gitignore                 # Git ignore rules
├── hardhat.config.js          # Hardhat network configuration
├── package.json               # Project dependencies
├── package-lock.json          # Dependency lock file
└── README.md                  # This file
```

---

## Prerequisites

Make sure you have the following installed before starting:

- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **npm** v8 or higher (comes with Node.js)
- **Git** → [git-scm.com](https://git-scm.com)
- **Google Chrome** with **MetaMask** extension → [metamask.io](https://metamask.io)
- A **Gmail account** with 2-Step Verification enabled
- A **Groq API key** (free) → [console.groq.com](https://console.groq.com)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mail-agent-x402.git
cd mail-agent-x402
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```bash
# Blockchain
PRIVATE_KEY=0xYourMetaMaskPrivateKey
WALLET_ADDRESS=0xYourMetaMaskWalletAddress
CONTRACT_ADDRESS=0xDeployedContractAddress

# AI
GROQ_API_KEY=gsk_your_groq_api_key_here

# Email
GMAIL_USER=youremail@gmail.com
GMAIL_APP_PASSWORD=your16charapppassword
```

> ⚠️ **Never commit your `.env` file to GitHub.** It is already in `.gitignore`.

#### How to get each value:

| Variable | How to get it |
|---|---|
| `PRIVATE_KEY` | MetaMask → Account Details → Show Private Key |
| `WALLET_ADDRESS` | Click your account name in MetaMask to copy |
| `CONTRACT_ADDRESS` | Printed after running the deploy script |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys → Create |
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | Google Account → Security → App Passwords → Create |

---

## Smart Contract

The `MailPayment.sol` contract is deployed on **Base Sepolia Testnet** and provides:

- `payForEmail(string recipientEmail)` — payable function, logs each email payment on-chain
- `setPrice(uint256 newPrice)` — owner can update the price per email
- `withdraw()` — owner can withdraw accumulated ETH
- `totalEmailsPaid` — public counter of total emails paid for

### Compile the contract

```bash
npx hardhat compile
```

### Deploy to Base Sepolia

Make sure you have testnet ETH in your wallet first (get it free from [faucet.base.org](https://faucet.base.org)).

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Copy the printed contract address into your `.env` as `CONTRACT_ADDRESS`.

### Verify on block explorer (bonus)

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> "100000000000000"
```

View your deployed contract at:
```
https://sepolia.basescan.org/address/<CONTRACT_ADDRESS>
```

---

## Running Locally

### Step 1 — Prepare your recipients CSV

Edit `recipients.csv` with your target recipients:

```csv
name,email,company,role
Priya Sharma,priya@example.com,TechCorp,CTO
Rahul Gupta,rahul@example.com,StartupXYZ,Founder
Anita Patel,anita@example.com,DesignCo,Designer
```

### Step 2 — Start the server

Open Terminal 1:

```bash
node server.js
```

You should see:
```
🚀 Server running on http://localhost:3000
```

### Step 3 — Run the agent

Open Terminal 2:

```bash
node agent.js
```

Expected output:
```
📋 Found 3 recipients
📧 Processing: Priya Sharma (priya@example.com)
💰 Payment token received
✅ Email sent to priya@example.com
📝 Preview: Hi Priya, I wanted to introduce you to MailMind...

📧 Processing: Rahul Gupta (rahul@example.com)
💰 Payment token received
✅ Email sent to rahul@example.com
...
🎉 All done!
```

---

## x402 Payment Flow

This project implements the **x402 payment protocol** — a standard where servers respond with HTTP `402 Payment Required` when a request hasn't been paid for.

```
Agent                          Server
  │                               │
  │──── POST /send-email ────────►│
  │                               │ 402 Payment Required
  │◄─── { error, amount } ───────│
  │                               │
  │──── POST /pay ───────────────►│
  │◄─── { token } ───────────────│
  │                               │
  │──── POST /send-email ────────►│
  │     x-payment-token: <token>  │
  │                               │ 200 OK — email sent
  │◄─── { success: true } ───────│
```

Every email costs one payment token. Tokens are single-use and expire after use.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for LLaMA model access |
| `GMAIL_USER` | ✅ Yes | Gmail address used to send emails |
| `GMAIL_APP_PASSWORD` | ✅ Yes | Gmail App Password (not your regular password) |
| `PRIVATE_KEY` | ✅ Yes | MetaMask wallet private key for contract deployment |
| `WALLET_ADDRESS` | ✅ Yes | Your MetaMask wallet address |
| `CONTRACT_ADDRESS` | ✅ Yes | Deployed MailPayment contract address on Base Sepolia |

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Invalid login: 535` | Wrong Gmail App Password | Regenerate App Password at myaccount.google.com |
| `insufficient funds for gas` | No testnet ETH in wallet | Get ETH from faucet.base.org |
| `GROQ_API_KEY is missing` | .env not loaded | Make sure .env is in root folder |
| `Cannot find module 'csv-parser'` | Dependencies not installed | Run `npm install` |
| `ECONNREFUSED 3000` | Server not running | Start server first with `node server.js` |
| `402 Payment Required` | Agent not sending token | Make sure agent.js calls `/pay` before `/send-email` |

---

## Git Workflow

```bash
# Push your progress regularly during the hackathon
git add .
git commit -m "checkpoint: description of what you did"
git push
```

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 MailMind

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgements

- [Groq](https://groq.com) — ultra-fast LLaMA inference API
- [Base](https://base.org) — Ethereum L2 blockchain by Coinbase
- [Hardhat](https://hardhat.org) — Ethereum development framework
- [x402 Protocol](https://x402.org) — HTTP payment standard for agents
- [Nodemailer](https://nodemailer.com) — Node.js email sending library

---

<p align="center">Built with ❤️ at Vibe-A-Thon Hackathon 2026 (By ofTheLosers)</p>
