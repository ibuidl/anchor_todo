import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';
import { TodoMulti } from '../target/types/todo_multi';
// import { PublicKey } from '@solana/web3.js';
const PublicKey = anchor.web3.PublicKey;

describe('todo_multi', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TodoMulti as Program<TodoMulti>;

  let todo1;
  let todo2;

  it('Creates multiple to-do items for a user', async () => {
    const todoId1 = new anchor.BN(1);
    const todoId2 = new anchor.BN(2);

    [todo1] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('todo'),
        provider.wallet.publicKey.toBuffer(),
        todoId1.toBuffer('le', 8)
      ],
      program.programId
    );

    [todo2] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('todo'),
        provider.wallet.publicKey.toBuffer(),
        todoId2.toBuffer('le', 8)
      ],
      program.programId
    );

    await program.methods
      .createTodo(todoId1, 'Todo 1', 'First to-do item')
      .accounts({
        todo: todo1,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    await program.methods
      .createTodo(todoId2, 'Todo 2', 'Second to-do item')
      .accounts({
        todo: todo2,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const todo1Account = await program.account.todo.fetch(todo1);
    const todo2Account = await program.account.todo.fetch(todo2);

    expect(todo1Account.title).to.equal('Todo 1');
    expect(todo2Account.title).to.equal('Todo 2');
  });

  it('Updates a to-do item', async () => {
    await program.methods
      .updateTodo('Updated Todo 1', 'Updated description', true)
      .accounts({
        todo: todo1,
        authority: provider.wallet.publicKey
      })
      .rpc();

    const todo = await program.account.todo.fetch(todo1);
    expect(todo.title).to.equal('Updated Todo 1');
    expect(todo.description).to.equal('Updated description');
    expect(todo.completed).to.be.true;
  });

  it('Deletes a to-do item', async () => {
    await program.methods
      .deleteTodo()
      .accounts({
        todo: todo1,
        authority: provider.wallet.publicKey
      })
      .rpc();

    try {
      await program.account.todo.fetch(todo1);
      throw new Error('Todo should be deleted');
    } catch (err) {
      expect(err.message).to.include('Account does not exist');
    }
  });
});
