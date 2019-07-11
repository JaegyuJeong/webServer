/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('certchain_account', {
		no: {
			type: DataTypes.INTEGER(45),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		create_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'certchain_account'
	});
};
