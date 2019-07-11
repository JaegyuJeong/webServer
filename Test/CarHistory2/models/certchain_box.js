/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('certchain_box', {
		no: {
			type: DataTypes.INTEGER(45),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		account_no: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		title: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		agency: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		create_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'certchain_box'
	});
};
