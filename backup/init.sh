mongorestore --config=db.yaml
mongoimport --config=db.yaml -d meta -c account data/account.json
mongoimport --config=db.yaml -d meta -c hide data/hide.json
mongoimport --config=db.yaml -d meta -c hidecomment data/hidecomment.json
mongoimport --config=db.yaml -d meta -c package data/package.json
mongoimport --config=db.yaml -d meta -c token data/token.json
mongoimport --config=db.yaml -d meta -c urlscan data/urlscan.json



