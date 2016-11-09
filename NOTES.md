cleanup ES:

    curl -XDELETE http://localhost:9200/pub/

Why Cookies?

https://github.com/socketio/socket.io-client/issues/976

- no headers (because spec)
- query seems ugly to me
- sounds like a good idea: https://github.com/socketio/socket.io-client/issues/976#issuecomment-235937211
