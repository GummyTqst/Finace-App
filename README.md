# 💰 Personal Finance SaaS

A modern personal finance management platform designed to help users understand where their money goes, plan their spending, track financial goals, and forecast their future finances.

The application turns the traditional personal-finance dashboard into a complete SaaS experience with transaction tracking, budgets, savings goals, recurring payments, financial reports, forecasting, and personalized insights.

---

## ✨ Overview

Managing personal finances often means jumping between banking apps, spreadsheets, budgeting apps, and notes.

This application aims to bring everything together in one place.

Users can:

- Track income and expenses
- Organize transactions into categories
- Create and manage budgets
- Set savings goals
- Track recurring payments and subscriptions
- Monitor multiple financial accounts
- Analyze spending habits
- View financial reports
- Forecast future balances
- Track net worth
- Receive financial insights
- Import transactions from CSV files

The goal is to provide a simple but powerful **financial command center**.

---

## 🎯 Core Concept

The application is built around three questions:

### Where is my money going?

Transactions, categories, subscriptions, and spending reports help users understand their financial habits.

### Where am I financially right now?

Balances, budgets, savings, and net worth provide a snapshot of the user's current financial situation.

### Where am I heading?

Goals, forecasts, recurring expenses, and financial insights help users plan ahead.

```text
                    YOUR MONEY
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       WHERE?         NOW?          NEXT?
          │             │             │
     Transactions     Budgets       Forecast
     Categories       Balance       Goals
     Subscriptions   Net Worth      Planning
     Spending        Savings        Insights
```

---

# 🚀 Features

## 📊 Dashboard

The dashboard provides an overview of the user's financial situation.

It can display:

- Current balance
- Monthly income
- Monthly expenses
- Savings
- Savings rate
- Budget progress
- Recent transactions
- Upcoming bills
- Savings goals
- Financial insights

Example:

```text
Good morning!

Total Balance
€4,820.50

Income
€3,200

Expenses
€1,840

Savings
€1,360

Savings Rate
42.5%
```

---

## 💳 Transactions

Users can manage all of their financial transactions.

Each transaction contains information such as:

- Description
- Amount
- Date
- Category
- Account
- Transaction type
- Notes

Example:

```text
Netflix
Entertainment
- €15.99

Salary
Income
+ €3,200

Supermarket
Food
- €83.42
```

### Transaction types

- Income
- Expense
- Transfer

Transfers between accounts should not be counted as expenses.

---

## 🏷️ Categories

Transactions can be grouped into customizable categories.

Default categories could include:

```text
Food
Shopping
Transport
Entertainment
Bills
Housing
Health
Education
Subscriptions
Salary
Other
```

Users can create their own categories as well.

---

# 💰 Budgets

Users can create monthly spending budgets.

Example:

```text
Food

€284.32 / €400

██████████████░░░

€115.68 remaining
```

The application can also calculate spending pace.

For example:

> You have €115 remaining with 21 days left in the month.

If the user's current spending rate is too high, the application can warn them.

```text
⚠️ You're spending faster than your monthly
budget allows.
```

---

# 🎯 Savings Goals

Users can create financial goals.

Example:

```text
Goal: New PC

Target:
€2,000

Current:
€850

Progress:
42.5%

Deadline:
December 1
```

The application can calculate the required monthly contribution:

```text
Required monthly saving:
€287
```

It can also estimate whether the user is currently on track to reach the goal.

---

# 🔄 Recurring Payments

The application can detect or allow users to manually create recurring transactions.

Examples:

```text
Netflix
€15.99 / month

Spotify
€10.99 / month

Adobe
€67.99 / month

Rent
€900 / month
```

Users can see:

- Monthly recurring cost
- Annual recurring cost
- Next payment
- Payment frequency
- Category

Example:

```text
Monthly recurring expenses
€104.96

Estimated yearly cost
€1,259.52
```

---

# 📺 Subscription Manager

Subscriptions receive their own dedicated section.

Users can track services such as:

- Streaming
- Software
- Cloud storage
- Gym memberships
- News services
- Gaming subscriptions
- Other recurring services

The application can highlight subscriptions that the user rarely uses.

Example:

```text
⚠️ Possible unused subscription

Adobe

Annual cost:
€815.88

Usage:
Rarely
```

---

# 🏦 Multiple Accounts

Users can manage multiple financial accounts.

Example:

```text
Accounts

Danske Bank
€4,280

Revolut
€820

Savings
€7,500

Cash
€120

────────────────

Total
€12,720
```

Accounts can contain:

- Current balance
- Account type
- Currency
- Transactions
- Institution name

---

# 📥 CSV Import

The first version of financial data importing can use CSV files.

Users can export transactions from their bank and upload them.

```text
Upload CSV
     ↓
Parse transactions
     ↓
Detect columns
     ↓
Categorize transactions
     ↓
Review
     ↓
Import
```

Example:

```text
Date        Description       Amount

08/08       NETFLIX           -15.99
08/08       SALARY           +3200
09/08       SUPERMARKET       -82.12
```

The application should allow users to review imported transactions before adding them.

---

# 📈 Financial Reports

Users can analyze their finances over different time periods.

Reports can include:

- Income
- Expenses
- Savings
- Savings rate
- Spending by category
- Monthly comparisons
- Budget performance
- Recurring expenses

Example:

```text
August 2026

Income
€3,200

Expenses
€1,840

Savings
€1,360

Savings Rate
42.5%
```

Users can compare periods:

```text
Category       July       August

Food           €420       €382 ↓
Shopping       €300       €421 ↑
Transport      €140       €122 ↓
Bills          €900       €900
```

---

# 🔮 Financial Forecast

The application can estimate future financial balances based on:

- Current balance
- Expected income
- Recurring expenses
- Planned savings
- Historical spending
- Upcoming bills

Example:

```text
Financial Forecast

Current balance
€4,820

Expected income
+ €3,200

Expected expenses
- €1,840

Expected balance
€6,180
```

The forecast can extend across multiple months.

```text
August
€4,820 → €6,180

September
€6,180 → €7,220

October
€7,220 → €8,040
```

Forecasts should be clearly presented as estimates rather than guaranteed financial outcomes.

---

# 🧠 Financial Insights

The application can automatically identify patterns in the user's financial data.

Examples:

```text
💰 Savings

You saved 38% of your income
this month.

That's €320 more than July.
```

```text
🍔 Food

Restaurant spending increased
34% compared with last month.
```

```text
🎯 Goals

Your PC savings goal is currently
ahead of schedule.
```

Insights can initially be generated using deterministic rules.

AI-powered insights can be added later.

---

# 🤖 AI Financial Assistant

A future version can include an AI assistant that allows users to ask questions about their own financial data.

Example:

> How much did I spend on food last month?

```text
You spent €382.40 on food in July.

That's €37.60 less than June.
```

Another example:

> Why did my expenses increase this month?

```text
Your expenses increased by €214.

The biggest contributors were:

Shopping       +€122
Restaurants     +€68
Transport       +€24
```

The assistant should focus on **financial organization and education**, rather than presenting itself as a professional financial advisor.

---

# 💎 Net Worth

Users can track their overall net worth.

```text
Net Worth

€38,420

Assets
────────────────
Savings       €12,000
Investments   €18,500
Cash           €1,200

Liabilities
────────────────
Credit Card    €1,280
Loan           €2,000
```

Historical net worth can be displayed as a chart.

```text
January    €31,200
February   €32,840
March      €34,120
April      €35,800
May        €37,200
June       €38,420
```

---

# 🕐 Financial Timeline

A timeline can combine important financial events into one view.

```text
August 2026

Aug 10
💰 Salary
+€3,200

Aug 11
🎯 Savings goal
+€500

Aug 12
🛒 Groceries
-€82

Aug 15
📺 Netflix
-€15.99

Aug 20
🏠 Rent
-€900

Aug 31
📊 Monthly review
```

The timeline can eventually include both historical and predicted events.

---

# 🔐 Security

Financial applications require strong security practices.

Planned security features include:

- Secure authentication
- Password hashing
- Two-factor authentication
- Session management
- Login history
- Data encryption
- Secure API authentication
- Data export
- Account deletion
- Minimal administrator access to financial data

The application should follow the principle of collecting and exposing as little sensitive financial information as possible.

---

# 💳 SaaS Plans

## Free

```text
€0 / month

✓ 1 account
✓ 500 transactions
✓ 3 budgets
✓ 3 savings goals
✓ Basic reports
✓ CSV import
```

## Plus

```text
€5.99 / month

✓ Unlimited accounts
✓ Unlimited transactions
✓ Unlimited budgets
✓ Unlimited goals
✓ Advanced reports
✓ Recurring expenses
✓ Financial forecasts
✓ Data export
```

## Pro

```text
€11.99 / month

Everything in Plus

✓ AI financial assistant
✓ Advanced forecasting
✓ Net worth tracking
✓ Custom categories
✓ Advanced insights
✓ Priority support
```

## Family

```text
€15.99 / month

✓ 2–5 users
✓ Shared accounts
✓ Shared budgets
✓ Family goals
✓ Individual spending
```

Pricing is subject to change during development.

---

# 🏗️ Application Architecture

The application is divided into several major parts.

```text
Enterprise Suite
│
├── Marketing
│   ├── Landing
│   ├── Features
│   ├── Pricing
│   ├── Security
│   └── FAQ
│
├── APP
│   ├── Dashboard
│   ├── Transactions
│   ├── Accounts
│   ├── Budgets
│   ├── Goals
│   ├── Subscriptions
│   ├── Reports
│   ├── Forecast
│   ├── Insights
│   └── Settings
│
├── API
│   ├── Auth
│   ├── Users
│   ├── Accounts
│   ├── Transactions
│   ├── Categories
│   ├── Budgets
│   ├── Goals
│   ├── Subscriptions
│   ├── Reports
│   ├── Forecast
│   └── Notifications
│
├── Admin
│   ├── Users
│   ├── Subscriptions
│   ├── Usage
│   └── System
│
└── Status
    ├── API
    ├── Database
    └── Workers
```

---

# 🗄️ Data Model

A simplified data structure could look like:

```text
User
 │
 ├── Accounts
 │     └── Transactions
 │
 ├── Budgets
 │
 ├── Goals
 │
 ├── Subscriptions
 │
 └── Categories
```

### User

```text
User
- id
- email
- passwordHash
- name
- currency
- createdAt
```

### Account

```text
Account
- id
- userId
- name
- type
- balance
- currency
- createdAt
```

### Transaction

```text
Transaction
- id
- userId
- accountId
- categoryId
- type
- description
- amount
- date
- notes
- createdAt
```

### Budget

```text
Budget
- id
- userId
- categoryId
- amount
- month
- year
```

### Goal

```text
Goal
- id
- userId
- name
- targetAmount
- currentAmount
- deadline
- createdAt
```

### Subscription

```text
Subscription
- id
- userId
- name
- amount
- frequency
- nextPayment
- categoryId
```

---

# 🛣️ Roadmap

## Phase 1 — MVP

- [ ] Authentication
- [ ] User dashboard
- [ ] Transactions
- [ ] Categories
- [ ] Accounts
- [ ] Budgets
- [ ] Savings goals
- [ ] Basic reports
- [ ] CSV import

## Phase 2 — Financial Management

- [ ] Recurring transactions
- [ ] Subscription tracking
- [ ] Multiple accounts
- [ ] Transaction search
- [ ] Advanced filtering
- [ ] Financial timeline
- [ ] Data export
- [ ] Notifications

## Phase 3 — Intelligence

- [ ] Financial forecasts
- [ ] Spending insights
- [ ] Goal predictions
- [ ] Net worth tracking
- [ ] Advanced reports

## Phase 4 — AI

- [ ] AI financial assistant
- [ ] Natural-language financial queries
- [ ] AI-generated insights
- [ ] AI spending explanations
- [ ] AI financial summaries

## Phase 5 — Advanced Integrations

- [ ] Bank integrations
- [ ] Automatic transaction synchronization
- [ ] Automatic transaction categorization
- [ ] Mobile/PWA improvements
- [ ] Family accounts
- [ ] Shared budgets

---

# 📱 PWA

The application is intended to work well as a Progressive Web App.

Users should be able to install it on desktop or mobile and access their financial dashboard without needing a traditional native application.

Mobile navigation:

```text
Home
Transactions
Goals
Budgets
More
```

Quick actions:

```text
+ Add transaction

Expense
Income
Transfer
```

---

# ⚠️ Financial Disclaimer

This application is intended for **personal financial organization, budgeting, and educational purposes**.

Financial forecasts and insights are estimates generated from user-provided data and should not be treated as professional financial, investment, tax, or legal advice.

Users should independently verify important financial decisions with qualified professionals where appropriate.

---

# 🎨 Design Inspiration

The initial UI concept is based on the [Frontend Mentor Personal Finance App challenge](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1).

The challenge provides the initial visual direction and dashboard concept, while this project expands it into a complete SaaS product with authentication, persistent financial data, subscriptions, reports, forecasting, and future AI functionality.

---

# 📌 Project Status

**Currently in planning / development.**

The initial goal is to build a functional personal finance MVP before adding advanced financial integrations and AI features.

---

## 💡 Product Vision

> **Don't just tell people where their money went. Help them understand where their money is going next.**
