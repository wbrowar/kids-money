import { Database } from 'sqlite3'
import { ISqlite, open } from 'sqlite'

export const useDb = async () => {
  const db = await open({
    filename: '/tmp/kids-money.db',
    driver: Database
  })

  async function createTables () {
    await db.exec(`CREATE TABLE users
     (
       id         INTEGER PRIMARY KEY,
       username   TEXT NOT NULL,
       password   TEXT NOT NULL,
       grown_up   TEXT NOT NULL UNIQUE
     );`)
  }

  function makeRequest ({
    params = {},
    query,
    type = 'get'
  }:{
    params?: any;
    query: ISqlite.SqlType;
    type: 'all' | 'get' | 'insert' | 'update';
  }) {
    let results

    switch (type) {
      case 'all':
        results = db.all(query)
        break
      case 'get':
        results = db.get(query)
        break
      case 'insert':
        results = db.run(query, params)
        break
    }

    return results
  }

  async function dbGetAll (query: ISqlite.SqlType) {
    return await makeRequest({ query, type: 'all' })
  }

  async function dbGetOne (query: ISqlite.SqlType) {
    return await makeRequest({ query, type: 'get' })
  }

  async function dbInsert (query: ISqlite.SqlType, params: any = {}) {
    return await makeRequest({ query, params, type: 'insert' })
  }

  return {
    dbGetAll,
    dbGetOne,
    dbInsert
  }
}
