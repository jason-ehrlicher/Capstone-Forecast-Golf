const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;

class WeatherData extends Model {}

WeatherData.init(
  {
    dt: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    dt_iso: DataTypes.STRING,
    temp: DataTypes.FLOAT,
    dew_point: DataTypes.FLOAT,
    feels_like: DataTypes.FLOAT,
    temp_min: DataTypes.FLOAT,
    temp_max: DataTypes.FLOAT,
    pressure: DataTypes.INTEGER,
    humidity: DataTypes.INTEGER,
    wind_speed: DataTypes.FLOAT,
    wind_deg: DataTypes.INTEGER,
    wind_gust: DataTypes.FLOAT,
    rain_1h: {
      type: DataTypes.FLOAT,
      allowNull: true, // Explicitly allowing null values
    },
    snow_1h: {
      type: DataTypes.FLOAT,
      allowNull: true, // Explicitly allowing null values
    },
    clouds_all: DataTypes.INTEGER,
    weather_id: DataTypes.INTEGER,
    weather_main: DataTypes.STRING,
    weather_description: DataTypes.STRING,
    weather_icon: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
  },
  {
    sequelize: sequelizeInstance,
    modelName: "weather_data",
    timestamps: false,
  }
);

module.exports = WeatherData;
