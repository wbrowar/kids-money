module.exports = {
  apps: [
    {
      name: 'KidsMoney',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        // Location of database file. It’s recommended that it’s an absolute path
        DATABASE_URL: 'file:./prisma/db/kids-money.db',
      }
    }
  ]
}
