# Kids Money

## Setup

1. Move files onto server.
2. Set the `DATABASE_URL` path to an absolute path where you would like your database to live.
3. Run database migration to set up sqlite database:
   ```bash
   npx prisma migrate deploy
   ```
4. Create an admin user using the command (the `-admin` argument is optional for other users):
   ```bash
   node scripts/create-user.mjs -u=my-username -p=my-password -admin=true
   ```

> you can manage your database using the command:
> ```bash
> npx prisma studio
> ```