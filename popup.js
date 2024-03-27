document.getElementById('classify').addEventListener('click', () => {
    // Get the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        // Execute a content script to get the image URL
        chrome.tabs.executeScript(tabs[0].id, { code: "document.querySelector('img').src;" }, async function (results) {
            const imageUrl = results[0];
            if (imageUrl) {
                // Create an Image element to load the image
                const imgElement = new Image();
                imgElement.crossOrigin = "anonymous"; // Enable cross-origin access for the image
                imgElement.onload = async function () {
                    // Call the classifyImage function with the loaded image
                    await classifyImage(imgElement);
                };
                imgElement.src = imageUrl;
            }
        });
    });
});

// Example function to classify an image element
async function classifyImage(imgElement) {
    // Preprocess the image to match your model's input requirements
    const tensor = tf.browser.fromPixels(imgElement).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const prediction = await model.predict(tensor).data();
    // Process the prediction to display the predicted class
    // For example, find the index with the highest probability
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    // Output the predicted class
    console.log('Predicted class:', maxIndex);
    // Display the predicted class in the popup (replace 'result' with the ID of the element where you want to display the result)
    document.getElementById('result').innerText = 'Predicted class: ' + maxIndex;
}

