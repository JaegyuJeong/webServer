/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('certchain_key', {
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
		encoded_key: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		memo: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		create_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'certchain_key'
	});
};
