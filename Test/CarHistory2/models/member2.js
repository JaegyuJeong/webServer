module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Member2', {
        mno: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        id: {
            type: Sequelize.STRING,
            allowNull: true
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });
}

