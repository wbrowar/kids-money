#!/bin/bash
. ~/.nvm/nvm.sh      # Load NVM
nvm use 24           # Switch to specific version
node src/server.ts   # Run your application