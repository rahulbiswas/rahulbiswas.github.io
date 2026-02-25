function getRandomInt(min, max) {
    // Math.random() gives a decimal between 0 (inclusive) and 1 (exclusive)
    // We multiply it to fit our range, then use Math.floor to chop off the decimals!
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Listen for a message from the main thread
self.onmessage = function(event) {
    const onionId = event.data;
    
    // Simulate HEAVY CPU work by freezing THIS specific worker thread for 3 seconds
    const start = Date.now();
	const span = getRandomInt(2500,3500)
    while (Date.now() - start < span) {
        // Chopping this specific onion... 🧅🔪
    }
    
    // Post a message back to the main thread saying we are done
    self.postMessage(onionId);
};