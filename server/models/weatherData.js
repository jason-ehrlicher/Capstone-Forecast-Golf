const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;

class WeatherData extends Model {}

WeatherData.init(
  {
    date: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    temp_mean: DataTypes.FLOAT,
    temp_min: DataTypes.FLOAT,
    temp_max: DataTypes.FLOAT,
    feels_like_mean: DataTypes.FLOAT,
    feels_like_min: DataTypes.FLOAT,
    feels_like_max: DataTypes.FLOAT,
    humidity_mean: DataTypes.FLOAT,
    wind_speed_mean: DataTypes.FLOAT,
    wind_speed_max: DataTypes.FLOAT,
    rain_sum: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    snow_sum: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    weather_main: DataTypes.STRING,
    weather_description: DataTypes.STRING,
    weather_icon: DataTypes.STRING,
  },
  {
    sequelize: sequelizeInstance,
    modelName: "weather_data",
    timestamps: false,
  }
);

module.exports = WeatherData;