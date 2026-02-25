const startBtn = document.getElementById('startBtn');
const progressText = document.getElementById('progress');

startBtn.addEventListener('click', () => {
    progressText.innerText = "Spawning 20 workers to chop in parallel...";
    startBtn.disabled = true;

    let choppedCount = 0;
    const totalOnions = 20;
    const startTime = Date.now();

    // Spawn 20 workers at the exact same time
    for (let i = 1; i <= totalOnions; i++) {
        // Create a new Web Worker from our separate file
        const worker = new Worker('worker.js');

        // Listen for when this specific worker finishes
        worker.onmessage = function(event) {
			console.log('event ', event.data)
            choppedCount++;
            progressText.innerText = `Chopped ${choppedCount} out of 20 onions...`;
            
            // Clean up: terminate the worker since its job is done!
            worker.terminate();

            // If all 20 workers have reported back, we are completely done
            if (choppedCount === totalOnions) {
                const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
                progressText.innerText = `Done! All 20 onions chopped in just ${totalTime} seconds! 
🚀`;
                startBtn.disabled = false;
            }
        };

        // Send a message to start the worker (passing the onion ID)
        worker.postMessage(i);
    }
});