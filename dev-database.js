import database from './database.js'

const { user: User } = database.sequelize.models

async function initDatabase() {
  try {
    await database.sequelize.sync()
    if (process.env.NODE_ENV === 'dev') {
      await User.findOrCreate({ where: { email: 'a' }, defaults: { displayName: 'Arnold', password: 'a' } })
      await User.findOrCreate({ where: { email: 'b' }, defaults: { displayName: 'Bernard', password: 'b' } })
      await User.findOrCreate({ where: { email: 'c' }, defaults: { displayName: 'Catherine', password: 'c' } })
    }
  } catch (e) {
    console.log('SEQUELIZE ERROR', e);
  }
}

initDatabase()

process.exit