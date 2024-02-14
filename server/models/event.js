const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;

const User = require("./user");

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id',
        },
      },
    
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    allDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "Event",
    tableName: 'Events',
    timestamps: true,
    freezeTableName: true,
  }
);

Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });

module.exports = Event;
