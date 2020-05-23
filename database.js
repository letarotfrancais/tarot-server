import dotenv from 'dotenv'
import Sequelize from 'sequelize'
import User from './models/user.js'

dotenv.config()

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD
} = process.env

const config = {
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  options: {
    dialect: 'postgres',
    host: DB_HOST,
    port: DB_PORT
  }
}

function sequelizeFactory(config) {
  if (!config) {
    throw new Error('you must provide a config for the ORM to be initialized')
  }
  let args = ['database', 'username', 'password', 'options'].map(param => config[param])
  return new Sequelize(...args)
}

const sequelize = sequelizeFactory(config)

const modelsFactories = [User]

modelsFactories.forEach(modelFactory => modelFactory(sequelize))

export default { sequelize, Sequelize }
