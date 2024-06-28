const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./configs.db')

db.run('CREATE TABLE IF NOT EXISTS confs(inchost TEXT NOT NULL PRIMARY KEY, conf JSON)', function () {
  db.run('INSERT INTO confs(inchost, conf) VALUES(?, ?)', [ 'example.wiki.nrn.io', JSON.stringify({
    data: './test/example.wiki.nrn.io',
    url: 'http://example.wiki.nrn.io'
  })], function (err) {
    console.log(err)
  })
})

