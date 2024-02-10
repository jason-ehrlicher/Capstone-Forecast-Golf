const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");

const sequelizeInstance = dbConnect.Sequelize;

class User extends Model {}

User.init(
  {
    // User ID
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // First Name
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Last Name
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Email Address
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Marketing Emails Preference
    marketingEmails: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },


    // Profile Picture URL
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true, // This and the following fields are optional at sign up
    },
    // Phone Number
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Date Created
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelizeInstance,
    modelName: "Users", 
    timestamps: true, 
    freezeTableName: true, 
  }
);

module.exports = User;