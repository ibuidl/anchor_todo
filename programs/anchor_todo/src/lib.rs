use anchor_lang::prelude::*;

declare_id!("BQJEbdQjtWFcgBxPtc2KNdzKH2GwWsPci67tJGreDPXh");

#[program]
mod anchor_todo {
    use super::*;

    pub fn create_todo(ctx: Context<CreateTodo>, title: String, description: String) -> Result<()> {
        let todo = &mut ctx.accounts.todo;
        todo.title = title;
        todo.description = description;
        todo.completed = false;
        Ok(())
    }

    pub fn update_todo(
        ctx: Context<UpdateTodo>,
        title: String,
        description: String,
        completed: bool,
    ) -> Result<()> {
        let todo = &mut ctx.accounts.todo;
        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        Ok(())
    }

    pub fn delete_todo(_ctx: Context<DeleteTodo>) -> Result<()> {
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Todo {
    #[max_len(16)]
    pub title: String,
    #[max_len(32)]
    pub description: String,
    pub completed: bool,
}

#[derive(Accounts)]
pub struct CreateTodo<'info> {
    #[account(init, payer = user, space = 8 + Todo::INIT_SPACE)]
    pub todo: Account<'info, Todo>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info> {
    #[account(mut)]
    pub todo: Account<'info, Todo>,
}

#[derive(Accounts)]
pub struct DeleteTodo<'info> {
    #[account(mut, close = user)]
    pub todo: Account<'info, Todo>,
    #[account(mut)]
    pub user: Signer<'info>,
}
