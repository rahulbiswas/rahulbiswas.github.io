const startBtn = document.getElementById('startBtn');
const progressText = document.getElementById('progress');

// This function artificially freezes the main JavaScript thread
function freezeThreadFor3Seconds() {
    const start = Date.now();
    // Busy-wait loop: literally forces the CPU to spin in circles for 3 seconds
    while (Date.now() - start < 3000) {
        // Chopping onions... blocking everything else...
    }
}

startBtn.addEventListener('click', async () => {
    progressText.innerText = "Starting to chop...";
    startBtn.disabled = true;

    for (let i = 1; i <= 20; i++) {
        // 1. Freeze the entire page for 3 seconds to "chop" one onion
        freezeThreadFor3Seconds();

        // 2. Update the text
        progressText.innerText = `Chopped ${i} out of 20 onions...`;

        // 3. This tiny delay allows the browser to actually paint the new text to the screen 
        // before we immediately lock up the thread again for the next onion.
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    progressText.innerText = "All 20 onions chopped!";
    startBtn.disabled = false;
});
