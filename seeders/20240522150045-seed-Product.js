'use strict';
const fs = require('fs').promises
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
   let data = JSON.parse(await fs.readFile('./data/products.json','utf-8'))
   data = data.map(ele =>{
    ele.createdAt = new Date()
    ele.updatedAt = new Date()
    
    return ele
   })
   await queryInterface.bulkInsert('Products', data)
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.bulkDelete('Products', null , {})
  }
};
