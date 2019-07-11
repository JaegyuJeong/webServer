/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('car', {
		vin: {
			type: DataTypes.STRING(50),
			allowNull: false,
			primaryKey: true
		},
		car_no: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		maker: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		car_name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		displacement: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		fuel: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		year: {
			type: "YEAR(4)",
			allowNull: true
		},
		body_type: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		vehicle_type: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		initial_insure_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		}
	}, {
		tableName: 'car'
	});
};
