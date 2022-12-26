module.exports  = {
  "development": {
    "username": process.env.DB_DEV_USERNAME,
    "password": "",
    "database": process.env.DB_DEV_DATABASE_NAME,
    "host": process.env.DB_DEV_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_PROD_USERNAME,
    "password": process.env.DB_PROD_PASSWORD,
    "database": process.env.DB_PROD_DATABASE_NAME,
    "host": process.env.DB_PROD_HOST,
    "dialect": "mysql"
  }
}
