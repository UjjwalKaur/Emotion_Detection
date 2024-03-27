let model;

async function loadModel() {
    // Load the model from cnn_model.h5
    model = await tf.loadLayersModel(chrome.runtime.getURL('cnn_model.h5'));
}

loadModel();

// Example function to classify an image element
async function classifyImage(imgElement) {
    // Preprocess the image to match your model's input requirements
    const tensor = tf.browser.fromPixels(imgElement).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const prediction = await model.predict(tensor).data();
    // Process the prediction to display your results
    // For example, find the index with the highest probability
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    // Output the predicted class
    console.log('Predicted class:', maxIndex);
}
