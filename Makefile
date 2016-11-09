iterate:
	rm -f bundle.js
	make bundle.js

bundle.js:
	browserify client.js -o bundle.js

server:
	python -mhttp.server

publish:
	curl -H "Content-Type: application/json" -v -XPOST localhost:3000/pub/foochan -d '{"hello": "world"}'

search:
	curl http://localhost:9200/pub/foochan/_search -d '{"sort": [{"timestamp": {"order": "desc"}}]}' | jq .
