use anchor_lang::prelude::*;

declare_id!("6PZYg7Upp674JzHBrqgakdSMh9c63yZrEp8Aujs8Mg7d");

#[program]
mod todo_multi {
    use super::*;

    pub fn create_todo(
        ctx: Context<CreateTodo>, 
        todo_id: u64, 
        title: String, 
        description: String
    ) -> Result<()> {
        let todo = &mut ctx.accounts.todo;
        todo.authority = *ctx.accounts.user.key;
        todo.todo_id = todo_id;
        todo.title = title;
        todo.description = description;
        todo.completed = false;
        Ok(())
    }

    pub fn update_todo(
        ctx: Context<UpdateTodo>, 
        title: String, 
        description: String, 
        completed: bool
    ) -> Result<()> {
        let todo = &mut ctx.accounts.todo;
        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        Ok(())
    }

    pub fn delete_todo(ctx: Context<DeleteTodo>) -> Result<()> {
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Todo {
    pub authority: Pubkey,  // The user who owns this todo
    pub todo_id: u64,       // A unique ID for this todo item
    #[max_len(16)]
    pub title: String,      // Title of the todo item
    #[max_len(32)]
    pub description: String, // Description of the todo item
    pub completed: bool,    // Completion status
}

#[derive(Accounts)]
#[instruction(todo_id: u64)]
pub struct CreateTodo<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Todo::INIT_SPACE, // space calculation
        seeds = [b"todo", user.key().as_ref(), &todo_id.to_le_bytes()],
        bump
    )]
    pub todo: Account<'info, Todo>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info> {
    #[account(
        mut, 
        has_one = authority,
        seeds = [b"todo", authority.key().as_ref(), &todo.todo_id.to_le_bytes()],
        bump
    )]
    pub todo: Account<'info, Todo>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTodo<'info> {
    #[account(
        mut, 
        close = authority,
        has_one = authority,
        seeds = [b"todo", authority.key().as_ref(), &todo.todo_id.to_le_bytes()],
        bump
    )]
    pub todo: Account<'info, Todo>,
    #[account(mut)]
    pub authority: Signer<'info>,
}
