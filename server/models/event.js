const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;

const User = require("./user");

// Defining the Event model class that extends Sequelize's Model class
class Event extends Model {}

Event.init(
  {
    // Definition of the id attribute with its data type, constraints, and properties
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // Definition of the userId attribute with its data type and foreign key constraint referencing the User model
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    // Definition of the title attribute with its data type and constraints
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Definition of the start attribute with its data type and constraints
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Definition of the end attribute with its data type and constraints
    end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Definition of the allDay attribute with its data type and default value
    allDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    // Configuring the Sequelize instance and options for the Event model
    sequelize: sequelizeInstance,
    modelName: "Event",
    tableName: "Events",
    timestamps: true,
    freezeTableName: true,
  }
);
// Defining the association between Event and User models
Event.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Event, { foreignKey: "userId", as: "events" });

module.exports = Event;
