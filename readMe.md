# Sales Unit - Multi-tenancy Backend

![Sales Unit Logo](sales-unit-logo.png)

Sales Unit is a Node.js application built using Sequelize, Sequelize CLI, and MySQL. It implements a multi-tenancy architecture where a single instance of the software serves multiple customers (tenants) with separate databases. Each tenant can customize certain aspects of the application while sharing the core codebase.

## Introduction

Multi-tenancy is an architectural approach that allows a single instance of a software application to serve multiple customers, where each customer is referred to as a tenant. Tenants have the ability to customize specific aspects of the application, such as the user interface color or business rules, but they cannot modify the application's core code.

## Description

The Sales Unit backend is designed as a multi-tenancy architecture, where each tenant (business owner) has their dedicated database (schema) to manage their operations. For example, when a user named John creates an account on the Sales Unit app, a unique database/schema (e.g., JohnDB001) is assigned to him. Within this database, John can create and manage his business (e.g., AgroFarm001), perform various business functions such as sales, expenses, purchases, inventory management, and access reporting features.

### Example:

- Create and manage businesses
- Perform sales transactions (debt/no debt)
- Manage debts
- Record expenses
- Receive notifications (SMS/Email)
- Send and download receipts
- Add and track purchases
- Manage product inventories
- Generate sales and expense reports
- Staff authorization (Coming soon)
- Admin dashboard to oversee all tenants and businesses

## Users

Sales Unit caters to the following user roles:

- **Sales Unit Admin**: Administer the entire application.
- **Business Owners**: Manage their businesses and operations within the system.
- **Staff**: (Feature coming soon) Authorized staff members who assist in business operations.

## Functionality

Sales Unit is designed with the following key principles in mind:

- **Reliability**: Ensuring stable and consistent operation.
- **Speed**: Delivering responsive and efficient performance.
- **Security**: Safeguarding user data and system integrity.
- **Logging/Monitoring**: Monitoring and tracking system activities for troubleshooting and optimization.

## Getting Started

To run this project locally or in your own environment, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/sales-unit-backend.git

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Configure your MySQL database connection in the `config/config.json` file.

4. Run the database migrations:

   ```bash
   npx sequelize db:migrate

   ```

5. Start the server:

   ```bash
   npm start
   ```

Now, the Sales Unit backend is up and running in your environment.
