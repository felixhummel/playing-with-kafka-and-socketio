iterate:
	rm -f bundle.js
	make bundle.js

bundle.js:
	browserify client.js -o bundle.js

server:
	python -mhttp.server

kafka2socketio:
	nodejs server.js
