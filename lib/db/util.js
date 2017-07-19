var mysql = require('mysql');
var async = require('async');

var pool;

function connect (callback) {
  pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql123',
  database: 'paymentapp',
  dateStrings: true
  })
};

function get() {
  return pool
};

function disconnect() {
	//in case of SIGINT ending
	console.log('Goodbye...');
    
};


module.exports.connect = connect;
module.exports.get = get;
module.exports.disconnect = disconnect;

/*Testing: insert into table
exports.fixtures = function(data) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  var names = Object.keys(data.tables)
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      var keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" })

      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
    }, cb)
  }, done)
}


Testing: drop/truncate table data
exports.drop = function(tables, done) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  async.each(tables, function(name, cb) {
    pool.query('DELETE * FROM ' + name, cb)
  }, done)
}*/


