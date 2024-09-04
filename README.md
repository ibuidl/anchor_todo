# anchor todo

> Copyright@[ibuidl](https://github.com/ibuidl)

### Overview

This project is a Solana smart contract built using the Anchor framework, which allows users to create, update, and delete multiple Todo items. Each user can manage their own set of Todo items, ensuring that only the user who created a Todo item can modify or delete it.

### Key Concepts and Knowledge Points

#### 1. **Solana Blockchain**

- Solana is a high-performance blockchain supporting fast transactions and low fees. This project leverages Solana's capabilities to create a decentralized Todo application where data is stored on-chain.

#### 2. **Anchor Framework**

- **Anchor** is a framework for Solana smart contract development that simplifies writing and deploying programs on Solana. It provides several features like account validation, error handling, and program ID management.
- The key components used in this project include:
  - **#[program]**: Defines the program module where all instructions (functions) are defined.
  - **#[account]**: Marks the structs that represent data stored in Solana accounts.
  - **Context Structs**: Used to validate and manage account inputs for each instruction.

#### 3. **Program Derived Addresses (PDAs)**

- **PDA**: A unique address generated deterministically using seeds and the program ID. PDAs are used in this project to uniquely identify each Todo item for a user, ensuring that no two Todo items share the same address.
- **Seeds**: This project uses a combination of a static string (`b"todo"`), the user's public key, and a unique `todo_id` to generate PDAs for each Todo item.

#### 4. **Account Management**

- **Account Initialization**: The `init` attribute is used to create new accounts for storing Todo items. The payer of the transaction (usually the user) is responsible for funding the account.
- **Account Validation**: Attributes like `has_one` ensure that only the owner of a Todo item (the user who created it) can update or delete it.
- **Account Closure**: When a Todo item is deleted, the account is closed, and any remaining SOL is refunded to the user.

### Project Structure

1. programs/anchor_todo
2. programs/todo_multi

### Running the Project

1. **Setup and Build**

   - Install dependencies and build the project using Anchor:
     ```bash
     anchor build
     ```

2. **Deploy the Program**

   - Deploy the program to the Solana blockchain (e.g., on Devnet or a local validator):
     ```bash
     anchor deploy
     ```

3. **Run Tests**
   - Use Anchor's testing framework to run the provided tests:
     ```bash
     anchor test
     ```

### Conclusion

This Todo project demonstrates key concepts in Solana and Anchor development, including the use of **PDAs**, **account management**, and secure **access control**.
