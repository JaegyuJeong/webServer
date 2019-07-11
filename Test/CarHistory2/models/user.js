/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		mno: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		pn: {
			type: DataTypes.STRING(20),
			allowNull: false
		}
	}, {
		tableName: 'user'
	});
};
