'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get formateddate() {
      return this.paymentDate.toLocaleDateString("id-ID")
    } 

    static associate(models) {
      // define association here
      Payment.belongsTo(models.Order)
    }
  }
  Payment.init({
    OrderId: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING,
    paymentAmount: DataTypes.FLOAT,
    paymentDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};