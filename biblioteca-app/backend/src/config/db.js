import sql from 'mssql/msnodesqlv8.js'
import dotenv from 'dotenv'

dotenv.config()

const useWindowsAuth = process.env.DB_WINDOWS_AUTH === 'true'
const sqlPool = await sql.connect({
  ...(useWindowsAuth ? {
    connectionString: `Driver={${process.env.DB_DRIVER || 'ODBC Driver 18 for SQL Server'}};Server=${process.env.DB_HOST || 'localhost'};Database=${process.env.DB_NAME};Trusted_Connection=Yes;TrustServerCertificate=Yes;Encrypt=No`,
  } : {
    server: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 1433),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    trustedConnection: process.env.DB_WINDOWS_AUTH === 'true',
  },
})

const replacePlaceholders = (query, values) => {
  let index = 0
  const text = query
    .replace(/\s+LIMIT\s+1\b/gi, '')
    .replace(/\s+FOR\s+UPDATE\b/gi, ' WITH (UPDLOCK, ROWLOCK)')
    .replace(/\?/g, () => `@param${index++}`)

  return { text, values }
}

const execute = async (query, values = [], transaction = null) => {
  const { text } = replacePlaceholders(query, values)
  const request = (transaction || sqlPool).request()
  values.forEach((value, index) => request.input(`param${index}`, value))
  const result = await request.query(text)
  const rows = result.recordset || []
  const metadata = {
    affectedRows: result.rowsAffected?.reduce((total, count) => total + count, 0) || 0,
    insertId: rows[0]?.id_libro || rows[0]?.id_prestamo || rows[0]?.id_usuario,
  }
  return [/^\s*SELECT\b/i.test(text) ? rows : metadata, metadata]
}

const pool = {
  execute,
  async getConnection() {
    const transaction = new sql.Transaction(sqlPool)
    return {
      execute: (query, values) => execute(query, values, transaction),
      beginTransaction: () => transaction.begin(),
      commit: () => transaction.commit(),
      rollback: () => transaction.rollback(),
      release: () => {},
    }
  },
}

export default pool