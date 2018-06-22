'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('hub', {
    columns: {
      token: 'string',
      meta: 'string'
    }
  })
};

exports.down = function(db) {
  return db.dropTable('hub');
};

exports._meta = {
  "version": 1
};
