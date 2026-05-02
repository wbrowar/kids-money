# Kids Money

A self-hosted money management app to help grownups manage "bank accounts"* for the kids in their life.

The app shows the current balance for each kid added to the app. Transactions (called _adjustments_ here) can add or subtract money to a kid’s balance.

Just like a real bank account, interest can add—or subtract—money from their balance over time. To help kids think more about saving money, the app shows how much interest they will earn over the next 7, 30, and 365 days.

Also, kids can set a savings goal and see their progress and an estimate of how long it will take to reach it.

<small>* "Bank account" as in not a real bank account. This doesn’t integrate with any sort of external system, and how the money is owned and paid to the kid is up to you.</small>

## Setup

This project splits up the front-end and back-end server into two separate directories.

The front-end lives in the `./front-end` directory and has its own `package.json` file. The front-end is compiled using Vite, and the production code is served from the `./front-end/dist` directory.

The back-end lives in the `./server` directory, and it has its own set of Node dependencies. The server is not compiled, and it is meant to be run directly from the `server` directory.

# Set Up the Front-End

1. Copy `./front-end/.env.example` to `./front-end/.env`.
2. If you prefer, you can change the URL that the server runs on by changing the `VITE_PUBLIC_API_URL` value.
3. Run `npm ci` to install dependencies.
4. Run `npm run build` to build out the front-end.
5. Point your web directory to the `./front-end/dist` directory.

# Set Up the Server

1. Copy `./server/.env.example` to `./server/.env`.
2. You must set the `DATABASE_URL` value to point to a SQLite database. The other values are optional.
3. Run `npm ci` to install dependencies.
4. Run database migration to set up the SQLite database. This will create the SQLite database file if one isn’t already created:
   ```bash
   npm run prisma:migrate:up
   ```
5. Run `npm run start` to start the server.


## User Management

Right now the only way to create a user is via a node script run on the command line:

```bash
node ./server/scripts/create-user.js --u=my-username --p=my-password --admin
```

In this script, the `--admin` argument is optional, but it’s needed to eneble the Settings page for the user to manage kids in the app, as well as to add or remove money from kids’ balances. You can set `--admin=false` to remove admin status from a user.

To update a user’s password or admin status, you can run the `update-user` script:

```bash
node ./server/scripts/update-user.js --u=my-username --p=my-new-password --admin=false
```

When updating a user, the username is a required field and the username cannot be changed. To change a username, you can create a new user with the new username and delete the existing user with the `delete-user` script:

```bash
node ./server/scripts/delete-user.js --u=my-username
```

> [!NOTE]
> All users have access to all kids and adjustments. Deleting a user will not delete any data, other than the user login credentials and admin status.

If you want to give access to kids, or to create a non-admin user, you can use the `create-user` script and omit the `--admin` argument:

```bash
node ./server/scripts/create-user.js --u=my-username --p=my-password
```

This user will be able to view all kids and adjustments, but they will not be able to visit the Settings page, or add new adjustments.

## Kid Settings

The Settings page will show a list of all the kids in the app with a list of settings associated with each kid. To change a setting, click on the current value, and it will pop up an input field. Make your change to the field and click elsewhere to make the popover go away. Once the setting has been saved, the kid’s data will show the new value in the list.

To add a new kid, use the `+ Add Kid` button at the top of the page. To remove a kid, take note of the ID for the kid, then click `Remove Kid`. This will ask you to enter in the ID for that kid to verify that you want to remove them from the app.

> [!NOTE]
> This ID is also the ID to use in CLI commands. The ID is automatically generated for the kid and will not change.

### Kid Users

If you have created a non-admin user for a kid, you can link the user with a kid on the Settings page. To do this, find the user under the `Users` section, click on the `Non-admin` button, and select the kid from the dropdown field.

The next time the kid logs into the app, they will be able to set their own savings goal on their own page.

## CLI Commands

If you want to set up a cron job, or if you prefer the command line for things, you can use the `add-adjustments` script to add (or remove) money for a specific kid.

In general, this starts with calling the command and passing in the ID for the kid:

```bash
node ./server/scripts/add-adjustment.js --kid=1
```

From there you will need to pass in arguments based on the type of adjustment you are trying to make. Here are some examples:

```bash
node ./server/scripts/add-adjustment.js --kid=1 --dollar=5
```

This adds $5 to the balance for the kid with the ID, `1`.

```bash
node ./server/scripts/add-adjustment.js --kid=1 --interest
```

This will increase the balance for the kid with the ID, `1`, by using the settings for the kid, `interest` and `interestThresholds`, to calculate the amount of interest to add to the balance.

> [!NOTE]
> You can only add either a dollar or interest adjustment per time the command is run. If you add arguments for both, you’ll get the dollar adjustment.


## Hosting

Hosting requires two different setups:

- A web directory that points to the `./front-end/dist` directory
- A Node.js server that can run the app

These can be hosted on one server that can do both of these things, or on separate servers.

### Hosting on the Edge

What makes this app tricky to host is that the code in the `server` directory needs to be hosted on a server where the server will continue to listen for API calls and where database files are allowed (which makes this harder to host on Netlify and Vercel). One option you can try out is to change the `DATABASE_URL` environment value to use a database that you have hosted elsewhere.

The connection to the database is done through Prisma, so [you can check out these options](https://www.prisma.io/docs/reference/database-reference/connection-urls) for setting up an external database connection.

While this isn’t fully tested, the app should run just fine—although maybe a little slower—and no other changes are needed, outside what is required to host a static site and Node.js server.

### Hosting on a VPS

You can host this project on a VPS (or similar hosting environment) as long as the following requirements can be met:

- The VPS’ NGINX or Apache server lets you proxy the port your app is running on (such as `:3000`)
- Node 24+ is installed, and you can SSH into the server to use it (BONUS: if you can use it in a deploy script, that’s even better)

As an example, here’s how you could host this project on a Laravel Forge-provisioned VPS:

1. Create a new site and set the web root to: `/front-end/dist`
2. Set your DNS to point to the server.
3. In NGINX settings, replace the `location /` block with the following (you can choose a different port to run the app if you’d like). Change the `FRONT_END_URL` to the URL you’ll visit in the browser:
   ```bash
   location /api/ {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_hide_header 'Access-Control-Allow-Origin';
   
       add_header 'Access-Control-Allow-Origin' 'FRONT_END_URL';
       add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
       add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
   
       if ($request_method = 'OPTIONS') {
           add_header 'Access-Control-Allow-Origin' 'FRONT_END_URL';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
           add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
           add_header 'Access-Control-Max-Age' 1728000; # Cache preflight for 20 days
           add_header 'Content-Type' 'text/plain; charset=utf-8';
           add_header 'Content-Length' 0;
           return 204;
       }
   }
   ```
4. Pull down this repo and move all the files to the site’s directory root. If you put it anywhere other than in the site root, that’s okay, but you’ll need to update the web root to point to the `/front-end/dist` folder.
5. [Install NVM (if you want to use it to manage node)](https://github.com/nvm-sh/nvm#installing-and-updating), otherwise make sure Node 24+ is installed and running as the server’s default Node version.
6. Set up a new Background Process, in Processes > Background Processes.
   1. Change the directory to an absolute path to the `server` directory.
   2. Set the command to: `npm run start`
   3. After the process is set up, copy the ID for the process to use it in the next step.
7. Add these scripts to your deployment settings to build and update everything, replacing `SITE_NAME` with the name of your site as it appears in Forge. Also replace `BACKGROUND_PROCESS_ID` with the ID of the Background Process you created in the previous step:
   ```bash
   cd /home/forge/SITE_NAME
   git pull origin $FORGE_SITE_BRANCH
   
   . ~/.nvm/nvm.sh
   
   # Install and build the front-end
   cd /home/forge/SITE_NAME/front-end
   
   nvm use
   
   npm install
   
   npm run build
   
   # Install and start the server
   cd /home/forge/SITE_NAME/server
   
   nvm use
   
   npm install
   
   npm run prisma:generate
   
   npm run prisma:migrate:up
   
   # Restart the background process
   sudo -S supervisorctl restart daemon-BACKGROUND_PROCESS_ID:*
   ```

## Scheduled Tasks

You can create a nightly backup of the database by trigger the `backup-db` Node script in a cron job. Again, using Forge as an example, you can create a new job in Processes > Scheduler > Scheduled jobs.

Again, the `SITE_NAME` can be replaced with the name of your site as it appears in Forge.

### Database file backup

```bash
/home/forge/.nvm/versions/node/v24.15.0/bin/node /home/forge/SITE_NAME/server/scripts/backup-db.js
```

This will create a copy of the SQLite database file in the `/home/forge/SITE_NAME/server/backups` directory. For redundancy, it would be a good idea to set up another job to move that file to another location that is off of your hosting server.

### Automatic interest adjustments

Another scheduled job can be set up to automatically add interest every night:
```bash
/home/forge/.nvm/versions/node/v24.15.0/bin/node /home/forge/SITE_NAME/server/scripts/add-adjustment.js --kid=1 --interest
```

Upon successful runs, you’ll see a confirmation in the log, noting which kid got updated and by how much.
