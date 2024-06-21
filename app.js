var isAdvancedUpload = function () {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

let draggableFileArea = document.querySelector(".drag-file-area");
let browseFileText = document.querySelector(".browse-files");
let uploadIcon = document.querySelector(".upload-icon");
let dragDropText = document.querySelector(".dynamic-message");
let fileInput = document.querySelector(".default-file-input");
let cannotUploadMessage = document.querySelector(".cannot-upload-message");
let cancelAlertButton = document.querySelector(".cancel-alert-button");
let uploadedFile = document.querySelector(".file-block");
let fileName = document.querySelector(".file-name");
let fileSize = document.querySelector(".file-size");
let progressBar = document.querySelector(".progress-bar");
let removeFileButton = document.querySelector(".remove-file-icon");
let uploadButton = document.querySelector(".upload-button");
let fileFlag = 0;

fileInput.addEventListener("click", () => {
    fileInput.value = '';
    console.log(fileInput.value);
});

fileInput.addEventListener("change", e => {
    console.log(" > " + fileInput.value)
    uploadIcon.innerHTML = 'check_circle';
    dragDropText.innerHTML = 'File Dropped Successfully!';
    document.querySelector(".label").innerHTML = `drag & drop or <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: 0;"> browse file</span></span>`;
    uploadButton.innerHTML = `Lancer l'analyse vocale`;
    fileName.innerHTML = fileInput.files[0].name;
    fileSize.innerHTML = (fileInput.files[0].size / 1024).toFixed(1) + " KB";
    uploadedFile.style.cssText = "display: flex;";
    progressBar.style.width = 0;
    fileFlag = 0;
});

uploadButton.addEventListener("click", () => {
    loadAndPredict();
    let isFileUploaded = fileInput.value;
    if (isFileUploaded != '') {
        if (fileFlag == 0) {
            fileFlag = 1;
            var width = 0;
            var id = setInterval(frame, 50);
            function frame() {
                if (width >= 390) {
                    clearInterval(id);
                    uploadButton.innerHTML = `<span class="material-icons-outlined upload-button-icon"> check_circle </span> Predict`;
                } else {
                    width += 5;
                    progressBar.style.width = width + "px";
                }
            }
        }
    } else {
        cannotUploadMessage.style.cssText = "display: flex; animation: fadeIn linear 1.5s;";
    }
});

cancelAlertButton.addEventListener("click", () => {
    cannotUploadMessage.style.cssText = "display: none;";
});

if (isAdvancedUpload) {
    ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(evt =>
        draggableFileArea.addEventListener(evt, e => {
            e.preventDefault();
            e.stopPropagation();
        })
    );

    ["dragover", "dragenter"].forEach(evt => {
        draggableFileArea.addEventListener(evt, e => {
            e.preventDefault();
            e.stopPropagation();
            uploadIcon.innerHTML = 'file_download';
            dragDropText.innerHTML = 'Drop your file here!';
        });
    });

    draggableFileArea.addEventListener("drop", e => {
        uploadIcon.innerHTML = 'check_circle';
        dragDropText.innerHTML = 'File Dropped Successfully!';
        document.querySelector(".label").innerHTML = `drag & drop or <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: -23px; left: -20px;"> browse file</span> </span>`;
        uploadButton.innerHTML = `Lancer l'analyse vocale`;

        let files = e.dataTransfer.files;
        fileInput.files = files;
        console.log(files[0].name + " " + files[0].size);
        console.log(document.querySelector(".default-file-input").value);
        fileName.innerHTML = files[0].name;
        fileSize.innerHTML = (files[0].size / 1024).toFixed(1) + " KB";
        uploadedFile.style.cssText = "display: flex;";
        progressBar.style.width = 0;
        fileFlag = 0;
    });
}

removeFileButton.addEventListener("click", () => {
    window.location.reload();
});
// given
/**
 * Initializes the audio context for the browser.
 * @returns {AudioContext} The initialized audio context.
 */
function getAudioContext() {
    return new (window.AudioContext || window.webkitAudioContext)();
}

/**
 * Asynchronously loads the TensorFlow model from a specified path.
 * @returns {Promise<tf.GraphModel>} The loaded TensorFlow model.
 */
async function loadModel() {
    const modelPath = 'tfjs_model/model.json';
    return await tf.loadGraphModel(modelPath);
}

/**
 * Reads an audio file and decodes it into an AudioBuffer.
 * @param {File} file The audio file to read.
 * @returns {Promise<AudioBuffer>} The decoded AudioBuffer.
 */
async function decodeAudioFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = getAudioContext();
    return await audioContext.decodeAudioData(arrayBuffer);
}

/**
 * Processes the audio buffer to match the input requirements of the TensorFlow model.
 * @param {AudioBuffer} audioBuffer The audio buffer to process.
 * @returns {tf.Tensor3D} The processed audio as a 3D tensor.
 */
function processAudioBuffer(audioBuffer) {
    const targetSampleRate = 16000;
    const inputLength = 16000;
    const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.duration * targetSampleRate,
        targetSampleRate
    );

    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);

    return offlineContext.startRendering().then(renderedBuffer => {
        let inputData = renderedBuffer.getChannelData(0);
        if (inputData.length > inputLength) {
            inputData = inputData.slice(0, inputLength);
        } else if (inputData.length < inputLength) {
            // Fill the remaining input with zeros if the audio is too short
            inputData = new Float32Array(inputLength).fill(0, 0, inputLength);
            inputData.set(renderedBuffer.getChannelData(0));
        }
        return tf.tensor3d(inputData, [1, inputLength, 1]);
    });
}


/**
 * Handles the TensorFlow model predictions by displaying the most likely prediction in the UI.
 * @param {tf.Tensor} outputTensor The output tensor from the model prediction.
 */
async function handlePrediction(outputTensor) {
    const prediction = await outputTensor.data();
    const highestPrediction = labels.map((label, index) => ({
        label: label, probability: prediction[index]
    })).sort((a, b) => b.probability - a.probability)[0];

    outputTensor.dispose();
    return { label: highestPrediction.label, probability: highestPrediction.probability };
}

/**
 * Orchestrates the loading, processing, and predicting of an audio file.
 */
async function loadAndPredict() {
    const audioFile = fileInput.files[0];

    console.log(audioFile);
    if (!audioFile) {
        console.log('Please upload an audio file.');
        return;
    }

    try {
        const startTime = performance.now();

        const audioBuffer = await decodeAudioFile(audioFile);
        const inputTensor = await processAudioBuffer(audioBuffer);
        const model = await loadModel();
        const outputTensor = await model.executeAsync(inputTensor);
        const result = await handlePrediction(outputTensor);

        const endTime = performance.now();
        const inferenceTime = endTime - startTime;

        showPredictionModal({
            label: result.label,
            probability: result.probability,
            inferenceTime: inferenceTime
        });
    } catch (error) {
        console.error('Error processing audio file:', error);
    }
}
function showPredictionModal(result) {
    // Update the modal content
    document.getElementById('resultLabel').textContent = `Prediction: ${result.label}`;
    document.getElementById('resultStats').textContent = `Probability: ${result.probability.toFixed(2)} | Inference Time: ${result.inferenceTime.toFixed(2)} ms`;

    // Display the modal
    document.getElementById('predictionOutput').style.display = 'block';
}

// Function to close the modal
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('predictionOutput').style.display = 'none';
});
// Close the modal when clicking outside of it
window.onclick = function (event) {
    if (event.target == document.getElementById('predictionOutput')) {
        document.getElementById('predictionOutput').style.display = 'none';
    }
}

const labels = [
    "background_noise", "forward", "groovit", "happy", "nine",
    "surpuissant", "two", "visual", "yes"
];
