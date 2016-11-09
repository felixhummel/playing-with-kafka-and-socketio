var app = require('express')();
var http = require('http').Server(app);
var elasticsearch = require('elasticsearch');
var io = require('socket.io')(http);

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
  // log: 'trace'
});

// http://expressjs.com/en/4x/api.html#req.body
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
// maybe skip parsing the payload altogether by using raw
// http://stackoverflow.com/a/18710277

// serve the client
app.get('/', function(req, res) {
  res.sendfile('index.html');
});

// publish messages
app.post('/pub/:channel', function(req, res) {
  var payload = req.body;
  var channel = req.params.channel;
  client.index({
    index: 'pub',
    type: channel,
    body: {
      channel: channel,
      timestamp: new Date(),
      payload: payload
    }
  }, function(error, response) {
  });
  console.log("channel:", channel, "json:", payload);
  io.emit(channel, JSON.stringify(payload));
  res.send('Got a POST request\n');
});

/**
 * Get the latest message from a channel in ES
 * @returns Promise
 */
function get_latest(channel) {
  // http://stackoverflow.com/a/20724072
  return client.search({
    index: 'pub',
    type: channel,
    body: {
      "sort": [
        {"timestamp": {"order": "desc"}}
      ],
      "size": 1
    }
  }).then(function(body) {
    var hits = body.hits.hits;
    // TODO handle empty
    if (hits.length == 1) {
      var latest = hits[0];
      return new Promise(function(resolve, reject) {
        return resolve(latest);
      });
    }
  });
}

// return latest (debug)
app.get('/latest/:channel', function(req, res) {
  var channel = req.params.channel;
  get_latest(channel).then(function(latest) {
    res.send(JSON.stringify(latest._source.payload) + '\n');
  }, function(error) {
    console.trace(error.message);
  });
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
