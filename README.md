# ojdl2
## Intro
ojdl2 is an online judge using [React.js](https://reactjs.org/) as frontend and [node.js](https://nodejs.dev/) as backend.
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

# Create database and user in MariaDB and give permission
# Example:
sudo mysql -e "CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; \
    GRANT ALL PRIVILEGES ON $DB_SCHEMA.* TO '$DB_USER'@'localhost'"

# Setup ojdl configurations
cp .sample.env .env
vim .env

# Install node_modules & build & run
npm install
NODE_ENV=production npm run build
sudo npm start
```


## Configure cgroups
Run `isolate-check-environment` to check if cgroup is enabled. cgroup v1 is required to run ioi/isolate sandbox. Useful links:
- [ioi/isolate manual](http://www.ucw.cz/moe/isolate.1.html#_installation)
- https://wiki.archlinux.org/title/cgroups#Enable_cgroup_v1

## SSL certification
`SSL_CERTIFICATE_PATH` and `SSL_PRIVATE_KEY_PATH` should be set to the path of the public and private key (resp.) in order to enable https.
Also, one could use `.challenge.env` to fulfill a simple http challenge. See `.sample.challenge.env` for more details.
