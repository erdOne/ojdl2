# ojdl2
## Intro
ojdl2 is an online judge uses React.js as frontend and node.js as backend.
oj的啦！

## Usage

```bash
# Clone the repo & install submodule
git clone https://github.com/erdOne/ojdl2.git
git submodule update --init --recursive
( cd isolate && make isolate )

# Insall & configure MariaDB server
# Example:
sudo pacman -S mariadb
sudo systemctl start mysql

# Setup ojdl configurations
cp config.sample.js config.js
vim config.js

# Install node_modules & build & run
npm install
NODE_ENV=production npm run build
sudo npm start
```
