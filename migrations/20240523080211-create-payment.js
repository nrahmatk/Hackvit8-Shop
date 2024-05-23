'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Orders',
          key : 'id'
        }
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
          isIn: [['pending', 'completed','failed']]
        }
      },
      paymentAmount: {
        type: Sequelize.FLOAT
      },
      paymentDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};