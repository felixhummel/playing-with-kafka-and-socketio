var app = require('express')();
// this is to parse cookies manually
var cookie = require('cookie');
// this is middleware for .cookie on req and res
var cookieParser = require('cookie-parser');
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

app.use(cookieParser());

// serve the client
app.get('/', function(req, res) {
  // set channel and auth via cookie
  // http://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework
  res.cookie('channel', 'foochan');
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
  res.send(`sent message to ${channel}\n`);
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
  var cookie_string = socket.client.request.headers.cookie;
  var cookie_data = cookie.parse(cookie_string);
  var channel = cookie_data['channel'];
  console.log('a user connected to channel ' + channel);
  get_latest(channel).then(function(latest) {
    socket.emit(channel, JSON.stringify(latest._source.payload));
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
