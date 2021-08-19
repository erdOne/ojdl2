## Usage

1. `git clone https://github.com/erdOne/ojdl2.git && git submodule update --init --recursive`
2. `( cd isolate && make isolate )`
3. Install & configure MariaDB.
4. `cp config.sample.js config.js` and setup the configurations.
5. `npm install && ./node_modules/.bin/gulp default && sudo npm start`
