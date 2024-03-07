const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;

// Defining the WeatherData model class that extends Sequelize's Model class
class WeatherData extends Model {}

// Initializing the WeatherData model with its attributes and configurations
WeatherData.init(
  {
    // Definition of the date attribute with its data type and primary key constraint
    date: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    // Definition of various weather-related attributes with their data types
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
    // Configuring the Sequelize instance and options for the WeatherData model
    sequelize: sequelizeInstance,
    modelName: "weather_data",
    timestamps: false,
  }
);

module.exports = WeatherData;
