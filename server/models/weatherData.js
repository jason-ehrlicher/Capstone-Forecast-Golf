const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;

class WeatherData extends Model {}

WeatherData.init(
  {
    dt: DataTypes.BIGINT,
    dt_iso: DataTypes.STRING,
    timezone: DataTypes.INTEGER,
    temp: DataTypes.FLOAT,
    temp_min: DataTypes.FLOAT,
    temp_max: DataTypes.FLOAT,
    feels_like: DataTypes.FLOAT,
    pressure: DataTypes.INTEGER,
    humidity: DataTypes.INTEGER,
    dew_point: DataTypes.FLOAT,
    clouds_all: DataTypes.INTEGER,
    weather_id: DataTypes.INTEGER,
    weather_main: DataTypes.STRING,
    weather_description: DataTypes.STRING,
    weather_icon: DataTypes.STRING,
    wind_speed: DataTypes.FLOAT,
    wind_deg: DataTypes.INTEGER,
    wind_gust: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    lat: DataTypes.FLOAT,
    city_name: DataTypes.STRING,
  },
  {
    sequelize: sequelizeInstance,
    modelName: "weather_data",
    timestamps: false,
  }
);

module.exports = WeatherData;
