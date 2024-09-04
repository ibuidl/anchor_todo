import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';
import { AnchorTodo } from '../target/types/anchor_todo';
const Keypair = anchor.web3.Keypair;

describe('anchor_todo', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorTodo as Program<AnchorTodo>;
  let todoAccount: anchor.web3.Keypair;

  it('Creates a new to-do item', async () => {
    todoAccount = Keypair.generate();
    await program.methods
      .createTodo('Test Todo', 'This is a test todo item')
      .accounts({
        todo: todoAccount.publicKey,
        user: provider.wallet.publicKey,
        // @ts-ignore
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([todoAccount])
      .rpc();

    const todo = await program.account.todo.fetch(todoAccount.publicKey);
    expect(todo.title).to.equal('Test Todo');
    expect(todo.description).to.equal('This is a test todo item');
    expect(todo.completed).to.be.false;
  });

  it('Updates the to-do item', async () => {
    await program.methods
      .updateTodo('Updated Todo', 'Updated description', true)
      .accounts({
        todo: todoAccount.publicKey
      })
      .rpc();

    const todo = await program.account.todo.fetch(todoAccount.publicKey);
    expect(todo.title).to.equal('Updated Todo');
    expect(todo.description).to.equal('Updated description');
    expect(todo.completed).to.be.true;
  });

  it('Deletes the to-do item', async () => {
    await program.methods
      .deleteTodo()
      .accounts({
        todo: todoAccount.publicKey,
        user: provider.wallet.publicKey
      })
      .rpc();

    try {
      await program.account.todo.fetch(todoAccount.publicKey);
      throw new Error('Todo should be deleted');
    } catch (err) {
      expect(err.message).to.include('Account does not exist');
    }
  });
});
