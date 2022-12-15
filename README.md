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

## User Management

Right now the only way to create a user is via a node script run on the command line:

```bash
node scripts/create-user.mjs -u=my-username -p=my-password -admin=true
```

In this script, the `-admin` argument is optional, but it’s needed in order to show the Settings page to manage kids in the app. You can choose to turn this on when you are setting up the project, then update the user to turn it off.

To update a user’s password or admin status, you can run the `update-user` script:

```bash
node scripts/update-user.mjs -u=my-username -p=my-new-password -admin=false
```

When updating a user, the username is a required field and the username cannot be changed. To change a username, you can create a new user with the new username and delete the existing user with the `delete-user` script:

```bash
node scripts/delete-user.mjs -u=my-username
```

> **NOTE:** All users have access to all kids and adjustments. Deleting a user will not delete any data, other than the user log in credentials and admin status.

## CLI Commands

If you want to set up a cron job (or if you prefer the command line for things) you can use the `add-adjustments` script to add (or remove) money for a specific kid.

In general, this starts with calling the command and passing in the slug for the kid:

```bash
node scripts/add-adjustment.mjs -kid=kid-slug
```

From there you will need to pass in arguments based on the type of adjustment you are trying to make. Here are some examples:

```bash
node scripts/add-adjustment.mjs -kid=kid-slug -dollar=5
```

This adds $5 to the balance for the kid with the slug, `kid-slug`.

```bash
node scripts/add-adjustment.mjs -kid=kid-slug -interest=1
```

This will increase the balance for the kid with the slug, `kid-slug`, by 1%.

> **NOTE:** You can only add either a dollar or interest adjustment per time the command is run. If you add arguments for both, you’ll get the dollar adjustment.

```bash
node scripts/add-adjustment.mjs -kid=kid-slug -allowance
```

This adds the amount set in Settings for the Allowance field for the kid with the slug, `kid-slug`.

```bash
node scripts/add-adjustment.mjs -kid=kid-slug -dollar=5
```

This adds the amount set in Settings for the Interest field for the kid with the slug, `kid-slug`.

> **NOTE:** You can also only use one `-allowence` or `-interest` argument per time the command is run. If you add both arguments an error will appear and you will need to update your command.

## Hosting

This is a Nuxt 3 project, so you can [follow instructions for deploying](https://nuxt.com/docs/getting-started/deployment) one and for running the app on various different server types.

### Hosting on the Edge

What makes this app tricky is that the SQLite database needs to be hosted on a server where it will persist and where database files are allowed (which makes this harder to host on Netlify and Vercel). One option you can try out is to change the `DATABASE_URL` environment value to use a database that you have hosted elsewhere.

The connection to the database is done through Prisma, so [you can check out these options](https://www.prisma.io/docs/reference/database-reference/connection-urls) for setting up an external database connection.

While this isn’t fully tested, the app should run just fine—although maybe a little slower—and no other changes are needed, outside what is required to host a Nuxt 3 app on that server.

### Hosting on a VPS

You can host this project on a VPS (or similar hosting environment) as long as the following requirements can be met:

- The VPS’ NGINX or Apache server lets you proxy the port your app is running on (such as `:3000`)
- Node 16+ is installed and you can SSH into the server to use it (BONUS: if you can use it in a deploy script that’s even better)

As an example, here’s how you could host this project on a Laravel Forge-provisioned VPS:

1. Create a new site and set the web root to: `/.output/public`
2. Set your DNS to point to the server.
3. In NGINX settings, replace the `location /` block with the following (you can choose a different port to run the app if you’d like):
   ```bash
   location / {
     proxy_pass http://127.0.0.1:3000;
     proxy_http_version 1.1;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection 'upgrade';
     proxy_set_header Host $host;
     proxy_cache_bypass $http_upgrade;
   }
   ```
3. Pull down this repo and move all of the files to the site’s directory root. If you put it anywhere other than in the site root, that’s okay, but you’ll need to update the web root to point to the `/.output/public` folder that Nuxt builds to.
4. [Install NVM (if you want to use it to manage node)](https://github.com/nvm-sh/nvm#installing-and-updating)
5. [Update `pm2` to the most recent version](https://pm2.keymetrics.io/docs/usage/update-pm2/) (or at least a version the works with `.mjs` files)
6. When updating the app, run these commands (from the root directory where you moved these files) to build and update everything:
   ```bash
   . ~/.nvm/nvm.sh use
   
   npm ci
   
   npm run prisma:migrate:up
   
   npm run build
   
   pm2 start
   ```
