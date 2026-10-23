#!/bin/bash

# Define where NVM lives (adjust if running as a different user)
export NVM_DIR="$HOME/.nvm"

# Manually load NVM
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# (Optional) Use a specific version or fallback to .nvmrc
# nvm use 20
nvm use

# Run your npm script
npm run start
