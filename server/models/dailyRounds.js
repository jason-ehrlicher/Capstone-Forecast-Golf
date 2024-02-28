const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;


class GolfRounds extends Model {}

GolfRounds.init(
  {
    // Unique ID
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // Date
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Day
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Rounds Played
    rounds_played: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "golf_Rounds", 
    timestamps: false, 
    freezeTableName: true, 
  }
);

module.exports = GolfRounds;
