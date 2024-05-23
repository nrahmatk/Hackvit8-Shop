'use strict';
var bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Username is required"
        },
        notEmpty: {
          msg: "Username is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required"
        },
        notEmpty: {
          msg: "Email is required"
        },
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required"
        },
        notEmpty: {
          msg: "Password is required"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role is required"
        },
        notEmpty: {
          msg: "Role is required"
        }
      }
  }
}, {
    hooks: {
      beforeCreate: async (user, options) => {
        try {
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(user.password, salt)
          user.password = hash
        } catch (error) {
          throw error
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};