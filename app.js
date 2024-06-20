let audioContext;
let recorder;
let audioStream;
let recordedChunks = [];

const labels = [
  "background_noise",
  "forward",
  "groovit",
  "happy",
  "nine",
  "surpuissant",
  "two",
  "visual",
  "yes",
];

const recordButton = document.getElementById("recordButton");
recordButton.addEventListener("click", toggleRecording);

async function toggleRecording() {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
    stopAudioStream();
    recordButton.textContent = "Appuyer pour enregistrer";
  } else {
    await startRecording();
    recordButton.textContent = "Arrêter l'enregistrement";
  }
}

async function startRecording() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!audioStream) {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    if (!recorder) {
      recorder = new MediaRecorder(audioStream);
      recorder.ondataavailable = (event) => recordedChunks.push(event.data);
      recorder.onstop = processAudio;
    }
    recordedChunks = [];
    recorder.start();
  } catch (error) {
    console.error("Error startin recording:", error);
  }
}

function stopAudioStream() {
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }
}

function processAudio() {
  const audioBlob = new Blob(recordedChunks, { type: "audio/webm" });
  const reader = new FileReader();
  reader.onload = async (event) => {
    const arrayBuffer = event.target.result;
    try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const audioData = audioBuffer.getChannelData(0);

      // Utiliser TensorFlow.js pour la prédiction ici
      await loadAndPredict(audioData);
    } catch (error) {
      console.error("Error decoding audio data:", error);
    } finally {
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    }
  };
  reader.readAsArrayBuffer(audioBlob);
}

async function loadAndPredict(audioData) {
  // Charger le modèle TensorFlow.js
  const model = await tf.loadGraphModel("tfjs-model/model.json");

  // Préparer les données pour la prédiction
  const inputTensor = tf.tensor(audioData.slice(0, 16000), [1, 16000, 1]);

  // Faire une prédiction
  const inputs = { input: inputTensor };
  const outputs = await model.executeAsync(inputs);

  // Assurez-vous que `outputs` est un tenseur ou une liste de tenseurs
  let prediction;
  if (outputs instanceof tf.Tensor) {
    prediction = outputs.dataSync();
  } else if (Array.isArray(outputs)) {
    prediction = outputs[0].dataSync();
  } else {
    throw new Error("Unexpected output format from model prediction.");
  }

  const predictedLabelIndex = prediction.indexOf(Math.max(...prediction));
  const predictedLabel = labels[predictedLabelIndex];

  // Afficher le résultat de la prédiction
  document.getElementById(
    "recognizedWord"
  ).textContent = `Le mot reconnu est : ${predictedLabel}`;

  // Utiliser l'API Web Speech pour répéter le mot reconnu
  const utterance = new SpeechSynthesisUtterance(predictedLabel);
  window.speechSynthesis.speak(utterance);
}

// Fonctionnalité existante
async function predict() {
  const audioUpload = document.getElementById("audioUpload");
  if (audioUpload.files.length === 0) {
    alert("Please upload a file");
    return;
  }
  const file = audioUpload.files[0];
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const audioData = audioBuffer.getChannelData(0);
  await loadAndPredict(audioData);
}

// Charger l'audio et faire une prédiction pour le téléchargement de fichier
async function decodeAudioFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = getAudioContext();
  return await audioContext.decodeAudioData(arrayBuffer);
}

function getAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)();
}
