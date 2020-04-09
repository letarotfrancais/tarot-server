import _ from 'lodash'
import uuid from 'uuid'

const { v4 } = uuid

class UserModel {
  constructor(profile) {
    this.id = v4()
    this.profiles = []
    this.profiles.push(_.cloneDeep(profile))
  }
  matchesProfile({provider, id}) {
    return _some(this.profiles, { provider, id})
  }
  getProfile({ id }) {
    return this.profiles.find(profile => profile.id === id)
  }
}

class User {
  collection = []
  findById(id) {
    return new Promise((resolve, reject) => {
      let user = _.find(this.collection, { id })
      if (user) {
        resolve(user)
      } else {
        reject(new UserError(`could not find user of id ${JSON.stringify(id)}`))
      }
    })
  }
  findByProfile(profile) {
    return new Promise((resolve, reject) => {
      let user = this.collection.find(user => user.matchesProfile(profile))
      if (user) {
        resolve(user)
      } else {
        reject(new UserError(`could not find user matching profile ${JSON.stringify(profile)}`))
      }
    })
  }
  findOrCreateByProfile(profile) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await this.findByProfile(profile))
      } catch (error) {
        let user = new UserModel(profile)
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