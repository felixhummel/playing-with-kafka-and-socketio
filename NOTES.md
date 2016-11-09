publish to `foochan`:

    curl -H "Content-Type: application/json" -v -XPOST localhost:3000/pub/foochan -d '{"hello": "world"}'

show stuff:

    curl http://localhost:9200/pub/foochan/_search | jq .

cleanup ES:

    curl -XDELETE http://localhost:9200/pub/
