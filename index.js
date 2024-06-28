const path = require('path')
const http = require('http')

const sqlite3 = require('sqlite3')

const server = require('wiki-server')

const farmPort = 3535

const db = new sqlite3.Database('./configs.db')

const defaultArgs = {
  port: farmPort,
  root: path.dirname(require.resolve('wiki-server')),
}

const hosts = {};

const farmServ = http.createServer(function (req, res) {
  const incHost = req.headers?.host.split(':')[0]
  if (hosts[incHost]) {
    return hosts[incHost](req, res);
  } else {
    db.get('SELECT conf from confs where inchost = ?', [ incHost ], function (err, row) {
      console.log(err, row)
      if (err) {
        res.statusCode = 500
        res.end('500')
        return
      }
      if (!row) {
        res.statusCode = 404
        res.end('404')
        return
      }
      const local = server(Object.assign({}, defaultArgs, JSON.parse(row.conf)))
      hosts[incHost] = local
      return local.once("owner-set", function() {
        local.emit('running-serv', farmServ);
        return hosts[incHost](req, res);
      });
    })
  }
})

farmServ.listen(farmPort)