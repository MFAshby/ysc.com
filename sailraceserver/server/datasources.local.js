module.exports = {
  db: {
    "name": "db",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "database": process.env.DB_DATABASE,
    "password": process.env.DB_PASSWORD,
    "user": process.env.DB_USER,
    "connector": "mysql"
  }
}


