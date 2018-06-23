import { Base as DBMigrateBase, CallbackFunction } from 'db-migrate-base'

export function up (db: DBMigrateBase, cb: CallbackFunction) {
  db.createTable('hub', {
    columns: {
      token: 'string',
      meta: 'string'
    }
  }, cb)
}

export function down (db: DBMigrateBase, cb: CallbackFunction) {
  db.dropTable('hub', cb)
}

export const _meta = {
  'version': 1
}
