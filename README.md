# infsci-2620-final
Developing Secure Systems Final Project

## Environment Setup (Ubuntu)
1. install git
2. install node (I did this using nvm)
    `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
    `nvm install 10.13.0`
    ``
3. install yarn `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
- `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
- `sudo apt-get update && sudo apt-get install yarn`

## App Setup
1. `git clone <project>`
2. cd into project
3. `yarn` - installs all dependencies

## Start Server
1. `yarn server:start` for regular dev work
2. `yarn server:debug` to start server for debugger node code

## Deployed to Heroku
1. `sudo snap install --classic heroku` (ubuntu)
2. https://dashboard.heroku.com/apps/infsci-2620-final/deploy/heroku-git
3. automatic deployments to heroku are enabled when merging to master
4. 