module.exports = {
  apps: [
    {
      name: 'KidsMoney',
      interpreter: '/home/forge/.nvm/versions/node/v24.15.0/bin/node',
      script: 'nvm use && node src/server.ts',
      watch: true,
      env: {
        DATABASE_URL: 'file:/home/forge/REPLACE_WITH_SITE_DIRECTORY_NAME/server/prisma/db/kids-money.db',
        CORS_ORIGIN: 'http://localhost:5173',
        SERVER_PORT: '3000',
      },
    },
  ],
}
