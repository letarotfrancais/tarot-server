import uuid from 'uuid'

const { v4: uuidv4 } = uuid

class UserModel {
  uniqueProperties = ['uuid', 'email']
  constructor(data) {
    this.uuid = uuidv4()
    Object.assign(this, data)
  }
  is(data) {
    return Object.keys(data).reduce((prev, property) => {
      return prev || (this.hasOwnProperty(property) && this.uniqueProperties.includes(property) && data[property] === this[property])
    }, false)
  }
  validatePassword(password) {
    return this.password === password
  }
}

class User {
  collection = []
  find(data) {
    return new Promise((resolve, reject) => {
      let user = this.collection.find(u => u.is(data))
      if (user) {
        resolve(user)
      } else {
        reject(new UserError(`could not find user identified by data ${JSON.stringify(data)}`))
      }
    })
  }
  create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        reject(await this.find(data))
      } catch (error) {
        let user = new UserModel(data)
        this.collection.push(user)
        resolve(user)
      }
    })
  }
}

class UserError extends Error {
}

const instance = new User()
Object.freeze(instance)
export default instance