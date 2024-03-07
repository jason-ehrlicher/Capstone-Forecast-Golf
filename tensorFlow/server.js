require('@tensorflow/tfjs-node');

const http = require('http');
const socketio = require('socket.io');
const pitch_type = require('./pitch_type');

const TIMEOUT_BETWEEN_EPOCHS_MS = 500;
const PORT = 8001;

// Util function to sleep for a given ms
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to start server, perform model training, and emit stats via the socket connection
async function run() {
  const port = process.env.PORT || PORT;
  const server = http.createServer();
  const io = socketio(server);

  server.listen(port, () => {
    console.log(`  > Running socket on port: ${port}`);
  });

  io.on('connection', (socket) => {
    socket.on('predictSample', async (sample) => {
      // Validate received sample length
      if (sample.length !== 26) {
          console.error("Received testSample with incorrect length:", sample.length);
          // Respond with an error message or handle as needed
          // For example, you might want to emit an error event back to the client
          socket.emit('error', 'Invalid test sample length. Expected 26 features, got ' + sample.length);
          return;
      }
  
      console.log("Received testSample for prediction:", sample, "Length:", sample.length); 
      io.emit('predictResult', await pitch_type.predictSample(sample));
    });
  });

  let numTrainingIterations = 10;

  for (var i = 0; i < numTrainingIterations; i++) {
    console.log(`Training iteration: ${i + 1} / ${numTrainingIterations}`);
    await pitch_type.model.fitDataset(pitch_type.trainingData, { epochs: 1 });
    console.log('Round range prediction accuracy:', await pitch_type.evaluate(true));
    await sleep(TIMEOUT_BETWEEN_EPOCHS_MS);
  }

  io.emit('trainingComplete', true);
}

run();