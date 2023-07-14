'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.changeColumn('Posts', 'userId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Users',
                key: 'userId',
            },
            onDelete: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.changeColumn('Users', 'userId', {
            type: Sequelize.INTEGER,
        });
    },
};
