const tf = require("@tensorflow/tfjs");
const path = require("path");

// util function to normalize a value between a given range.
function normalize(value, min, max) {
  if (min === undefined || max === undefined) {
    return value;
  }
  return (value - min) / (max - min);
}

const TRAIN_DATA_PATH =
  "file:///Users/jasonehrlicher/git/Mini-Project-II/tensorFlow/data/TrainingData.csv";
const TEST_DATA_PATH =
  "file:///Users/jasonehrlicher/git/Mini-Project-II/tensorFlow/data/TestingData.csv";

// Constants from training data

const TEMP_MIN = 26.96;
const TEMP_MAX = 87.98;
const TEMP_MIN_MIN = 25;
const TEMP_MIN_MAX = 85;
const TEMP_MAX_MIN = 30;
const TEMP_MAX_MAX = 95;
const HUMIDITY_MIN = 37;
const HUMIDITY_MAX = 99;
const WIND_SPEED_MIN = 0.69;
const WIND_SPEED_MAX = 22.57;
const WIND_GUST_MIN = 1.01;
const WIND_GUST_MAX = 31;
const RAIN_1H_MIN = 0;
const RAIN_1H_MAX = 32.77;

const NUM_ROUNDS_CLASSES = 11;
const TRAINING_DATA_LENGTH = 697;
const TEST_DATA_LENGTH = 99;

function dayOfWeekToInt(day) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days.indexOf(day);
}

function oneHotDay(dayString) {
  const day = dayOfWeekToInt(dayString);
  return Array.from({ length: 7 }, (_, index) => (index === day ? 1 : 0));
}

function oneHotMonth(dateString) {
  const month = new Date(dateString).getMonth(); // Extracts month as 0 (January) to 11 (December)
  return Array.from({ length: 12 }, (_, index) => (index === month ? 1 : 0));
}
function roundsRangeToOneHot(label) {
  const labels = ["0-19", "20-39", "40-59", "60-79", "80-99", "100-119", "120-139", "140-159", "160-179", "180-200"];
  const index = labels.indexOf(label);
  return Array.from({ length: labels.length }, (_, i) => (i === index ? 1 : 0));
}


// Converts a row from the CSV into features and labels.
// Each feature field is normalized within training data constants
const csvTransform = ({ xs, ys }) => {
  const dayVector = oneHotDay(xs.day);
  const monthVector = oneHotMonth(xs.date);

  const values = [
    normalize(xs.temp, TEMP_MIN, TEMP_MAX),
    normalize(xs.temp_min, TEMP_MIN_MIN, TEMP_MIN_MAX),
    normalize(xs.temp_max, TEMP_MAX_MIN, TEMP_MAX_MAX),
    normalize(xs.humidity, HUMIDITY_MIN, HUMIDITY_MAX),
    normalize(xs.wind_speed, WIND_SPEED_MIN, WIND_SPEED_MAX),
    normalize(xs.wind_gust || 0, WIND_GUST_MIN, WIND_GUST_MAX), // Handle missing wind_gust values
    normalize(xs.rain_1h || 0, RAIN_1H_MIN, RAIN_1H_MAX), // Handle missing rain_1h values
    ...dayVector,
    ...monthVector,
  ];

  // Update this line to use the roundsRangeToOneHot function
  const label = roundsRangeToOneHot(ys.roundsRange);

  return { xs: values, ys: label };
};

  // console.log(`Transformed features: ${JSON.stringify(xs)}`);
// Assuming `transformedLabel` is your label object
// console.log(`Transformed label: ${JSON.stringify(ys)}`);





const trainingData = tf.data
  .csv(TRAIN_DATA_PATH, { columnConfigs: { RoundsRange: { isLabel: true } } }) // Update to use the correct label column name
  .map(csvTransform)
  .shuffle(TRAINING_DATA_LENGTH)
  .batch(100);

// Load all training data in one batch to use for evaluation
const trainingValidationData = tf.data
  .csv(TRAIN_DATA_PATH, { columnConfigs: { RoundsRange: { isLabel: true } } }) // Update the label column name to match your dataset
  .map(csvTransform)
  .batch(TRAINING_DATA_LENGTH); // Load all data in one batch for validation

// Load all test data in one batch to use for evaluation
const testValidationData = tf.data
  .csv(TEST_DATA_PATH, { columnConfigs: { RoundsRange: { isLabel: true } } }) // Updated to the correct label column name
  .map(csvTransform)
  .batch(TEST_DATA_LENGTH); // Batch size set to the total number of test samples

const model = tf.sequential();
model.add(tf.layers.dense({units: 300, activation: 'relu', inputShape: [26]})); // Changed units from 250 to 300
model.add(tf.layers.dense({ units: 175, activation: "relu" }));
model.add(tf.layers.dense({ units: 150, activation: "relu" }));
model.add(tf.layers.dense({units: 100, activation: 'relu'}));
model.add(tf.layers.batchNormalization());
model.add(tf.layers.dropout({rate: 0.5}));
model.add(
  tf.layers.dense({ units: 10, activation: "softmax" }) // Corrected to match the number of unique classes
);


// model.compile({
//   optimizer: tf.train.adam(),
//   loss: "sparseCategoricalCrossentropy",
//   metrics: ["accuracy"],
// });

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});



// Returns pitch class evaluation percentages for training data
// with an option to include test data
async function evaluate(useTestData) {
  let results = {};
  // Evaluate on training data
  await trainingValidationData.forEachAsync((dataBatch) => {
    const values = model.predict(dataBatch.xs).dataSync();
    const classSize = TRAINING_DATA_LENGTH / NUM_ROUNDS_CLASSES;
    for (let i = 0; i < NUM_ROUNDS_CLASSES; i++) {
      results[rangeFromClassNum(i)] = {
        // Make sure rangeFromClassNum is appropriately renamed to reflect its purpose
        training: calcClassEval(i, classSize, values),
      };
    }
  });

  // Optionally evaluate on test data
  if (useTestData) {
    await testValidationData.forEachAsync((dataBatch) => {
      const values = model.predict(dataBatch.xs).dataSync();
      const classSize = TEST_DATA_LENGTH / NUM_ROUNDS_CLASSES;
      for (let i = 0; i < NUM_ROUNDS_CLASSES; i++) {
        if (!results[rangeFromClassNum(i)].validation) {
          // Check if validation key exists to avoid overwriting training data
          results[rangeFromClassNum(i)].validation = calcClassEval(
            i,
            classSize,
            values
          );
        }
      }
    });
  }
  return results;
}

async function predictSample(sample) {
  const sampleTensor = tf.tensor(sample, [1, sample.length]);
  const predictionTensor = model.predict(sampleTensor);
  const predictedClass = predictionTensor.argMax(-1).dataSync()[0];
  return rangeFromClassNum(predictedClass);
}

// Determines evaluation for a given class by index
function calcClassEval(classIndex, classSize, values) {
  // Assuming 'values' contains the flattened array of prediction probabilities
  // for each class, and you're interested in the average probability of being correct
  // for the given classIndex across all samples.
  let index = classIndex; // Starting index for the first instance of this class
  let total = 0;

  for (let i = 0; i < classSize; i++) {
    total += values[index]; // Add the probability of the classIndex being correct
    index += NUM_ROUNDS_CLASSES; // Move to the next instance of this class in the predictions
  }

  return total / classSize; // Return the average probability for this class
}

// Returns the string value for Baseball pitch labels
function rangeFromClassNum(classNum) {
  switch (classNum) {
    case 0:
      return "0-19";
    case 1:
      return "20-39";
    case 2:
      return "40-59";
    case 3:
      return "60-79";
    case 4:
      return "80-99";
    case 5:
      return "100-119";
    case 6:
      return "120-139";
    case 7:
      return "140-159";
    case 8:
      return "160-179";
    case 9:
      return "180-200";
    default:
      return "Unknown";
  }
}

module.exports = {
  evaluate,
  model,
  rangeFromClassNum,
  predictSample,
  testValidationData,
  trainingData,
  TEST_DATA_LENGTH,
};
