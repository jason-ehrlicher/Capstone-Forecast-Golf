import io from "socket.io-client";

const predictContainer = document.getElementById("predictContainer");
const predictButton = document.getElementById("predict-button");

const socket = io("http://localhost:8001", {
  reconnectionDelay: 300,
  reconnectionDelayMax: 300,
});

const testSample = [
  0.5, // Normalized temperature
  0.3, // Normalized minimum temperature
  0.7, // Normalized maximum temperature
  0.8, // Normalized humidity
  0.2, // Normalized wind speed
  0.1, // Normalized wind gust
  0.0, // Normalized rain 1h
  0,
  0,
  0,
  0,
  0,
  1,
  0, // One-hot encoded day of the week (e.g., Friday)
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0, // One-hot encoded month (e.g., August)
];

predictButton.onclick = () => {
  // Validate testSample length before sending
  if (testSample.length !== 26) {
    console.error("Invalid test sample length:", testSample.length);
    alert(
      "Test sample has invalid length. Expected 26 features, got " +
        testSample.length
    );
    predictButton.disabled = false; // Re-enable the button to allow corrections
    return;
  }

  console.log("Sending testSample:", testSample, "Length:", testSample.length);
  predictButton.disabled = true;
  socket.emit("predictSample", testSample);
};

// Functions to handle socket events
socket.on("connect", () => {
  document.getElementById("waiting-msg").style.display = "none";
  document.getElementById("trainingStatus").innerHTML = "Training in Progress";
});

socket.on("trainingComplete", () => {
  document.getElementById("trainingStatus").innerHTML = "Training Complete";
  document.getElementById("predictSample").innerHTML =
    "[" + testSample.join(", ") + "]";
  predictContainer.style.display = "block";
});

socket.on("predictResult", (result) => {
  plotPredictResult(result);
});

socket.on("disconnect", () => {
  document.getElementById("trainingStatus").innerHTML = "";
  predictContainer.style.display = "none";
  document.getElementById("waiting-msg").style.display = "block";
});

function plotPredictResult(result) {
  predictButton.disabled = false;
  document.getElementById("predictResult").innerHTML =
    "Predicted Rounds Range: " + result;
  console.log("Predicted Rounds Range:", result);
}
