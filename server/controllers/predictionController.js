const Models = require("../models");
const sequelize = require("sequelize");

// Controller function to get the average rounds played for a specific day
const getAverageRoundsForDay = async (req, res) => {
  const { date } = req.body;

  try {
    // Adjust the date to include a time part, setting it to noon UTC
    const adjustedDate = new Date(date + "T12:00:00Z");
    const dayOfWeek = adjustedDate.toLocaleString("en-US", { weekday: "long" });

    // Querying the database to get the average rounds played for the specified day
    const rounds = await Models.GolfRounds.findAll({
      where: sequelize.where(
        sequelize.fn("DAYNAME", sequelize.col("date")),
        dayOfWeek
      ),
      attributes: [
        [
          sequelize.fn("AVG", sequelize.col("rounds_played")),
          "averageRoundsPlayed",
        ],
      ],
      raw: true,
    });

    // If data is found, send the average rounds played as response
    if (rounds.length > 0 && rounds[0].averageRoundsPlayed) {
      res
        .status(200)
        .json({
          averageRoundsPlayed: Math.round(rounds[0].averageRoundsPlayed),
        });
    } else {
      res.status(404).send({ message: `No data found for day ${dayOfWeek}.` });
    }
  } catch (error) {
    console.error("Error calculating average rounds played:", error);
    res
      .status(500)
      .send({
        message: "Error calculating average rounds played",
        error: error.message,
      });
  }
};

module.exports = {
  getAverageRoundsForDay,
};
