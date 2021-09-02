# ojdl2
## Intro
ojdl2 is an online judge using React.js as frontend and node.js as backend.
oj的啦！

## Usage

```bash
# Clone the repo & install submodule
git clone https://github.com/erdOne/ojdl2.git
cd ojdl2
git submodule update --init --recursive
( cd isolate && make isolate && sudo make install )

# Insall & configure MariaDB server
# Example:
sudo pacman -S mariadb
sudo systemctl start mysql

# Create database and user in mysql and give permission
sudo mysql
## ( ... )

# Configure cgroups
## ( ... )

# Setup ojdl configurations
cp .env.sample .env
vim .env

# Install node_modules & build & run
npm install
NODE_ENV=production npm run build
sudo npm start
```
