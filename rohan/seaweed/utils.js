/**
 * Simple sleep/delay function
 * @param {number} ms - Milliseconds to wait
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Downloads generated puzzles as JSON file
 * @param {Array} configs - Array of puzzle configurations to download
 */
function downloadConfigs(configs) {
    const blob = new Blob([JSON.stringify(configs, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seaweed-configs.json';
    a.click();
}

export { sleep, downloadConfigs };
