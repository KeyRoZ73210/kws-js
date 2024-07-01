// Vérifie si le navigateur supporte l'API Web Speech
if (!("webkitSpeechRecognition" in window)) {
  alert("API Web Speech non supportée par ce navigateur. Essayez avec Chrome.");
} else {
  const startRecordBtn = document.getElementById("start-record-btn");
  const transcriptArea = document.getElementById("transcript");

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
    transcriptArea.value += transcript + "\n";

    if (transcript == "bonjour") {
      alert("Bonjour a tous");
    }
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
