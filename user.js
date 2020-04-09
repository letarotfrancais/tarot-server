class UserModel {
  constructor({email, password}) {
    this.email = email
    this.password = password
  }
  validatePassword(password) {
    return this.password === password
  }
}

class User {
  collection = []
  find(email) {
    return new Promise((resolve, reject) => {
      let user = this.collection.find(u => u.email === email)
      if (user) {
        resolve(user)
      } else {
        reject(new UserError(`could not find user identified by email ${JSON.stringify(email)}`))
      }
    })
  }
  findOrCreate(data) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await this.find(data.email))
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