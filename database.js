import Sequelize from 'sequelize'
import User from './models/user.js'

const configs = {
  dev: {
    database: 'database',
    username: null,
    password: null,
    options: { dialect: 'sqlite' }
  }
}

function sequelizeFactory(config) {
  if (!config) {
    throw new Error('you must provide a config for the ORM to be initialized')
  }
  let args = ['database', 'username', 'password', 'options'].map(param => config[param])
  return new Sequelize(...args)
}

const sequelize = sequelizeFactory(configs['dev'])

const modelsFactories = [User]

modelsFactories.forEach(modelFactory => modelFactory(sequelize))

export default { sequelize, Sequelize }
