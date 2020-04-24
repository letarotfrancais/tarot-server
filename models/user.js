import Sequelize from 'sequelize'
import uuid from 'uuid'

const { Model, DataTypes } = Sequelize
const { v4: uuidv4 } = uuid

export default function(sequelize) {
  class User extends Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: uuidv4
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'user'
    }
  )

  return User
}