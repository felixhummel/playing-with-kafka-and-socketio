- https://phabricator.wikimedia.org/diffusion/WKSK/
- https://www.npmjs.com/package/kasocki
- "Get upstream fix for https://github.com/Blizzard/node-rdkafka/issues/5 this will need to be resolved before this can be used in any type of production setting" :(

Prereq
```
$ node --version
v4.6.1
$ python --version
Python 3.5.1
```

Install
```
sudo npm install -g browserify
npm install  # see package.json
pip install -r requirements.txt  # for produce.py
```

Run
```
docker-compose up  # kafka
./produce.py  # to generate messages
node server.js  # kafka --> socket.io
make iterate  # client.js --> bundle.js
make server  # localhost:8000
```

