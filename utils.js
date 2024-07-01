// Vérifie si le navigateur supporte l'API Web Speech
if (!("webkitSpeechRecognition" in window)) {
  alert("API Web Speech non supportée par ce navigateur. Essayez avec Chrome.");
} else {
  const startRecordBtn = document.getElementById("start-record-btn");

  // Initialise la reconnaissance vocale
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "fr-FR";

  recognition.onstart = function () {
    startRecordBtn.disabled = true;
    startRecordBtn.textContent = "Enregistrement en cours...";
  };

  recognition.onend = function () {
    startRecordBtn.disabled = false;
    startRecordBtn.textContent = "Enregistrer";
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    
    const validTranscripts = ["bonjour", "salut", "surpuissant", "groovit"];

    if (validTranscripts.includes(transcript)) {
      // Show modal
      showPredictionModal(transcript);
    }
    /* else{
      showPredictionModal(transcript + " (non reconnu)");
    } */

  };
  recognition.onerror = function (event) {
    console.error(event.error);
  };

  function startRecording() {
    recognition.start();
    setTimeout(() => {
      recognition.stop();
    }, 3000); // Arrête la reconnaissance après 1 seconde
  }
}


/* MODAL */

function showPredictionModal(transcript) {
  let transcriptArea = document.getElementById("transcript");
  console.log(transcript);
  transcriptArea.innerText += transcript + "\n";
  // Display the modal
  document.getElementById('predictionOutput').style.display = 'block';
}

// Function to close the modal
document.getElementById('closeModal').addEventListener('click', function () {
  let transcriptArea = document.getElementById("transcript");
  document.getElementById('predictionOutput').style.display = 'none';
  transcriptArea.innerText = "";
});
// Close the modal when clicking outside of it
window.onclick = function (event) {
  if (event.target == document.getElementById('predictionOutput')) {
    let transcriptArea = document.getElementById("transcript");
    document.getElementById('predictionOutput').style.display = 'none';
    transcriptArea.innerText = "";
  }
}