const funFacts = [
    "Mancala is one of the oldest known games, with evidence dating back thousands of years to ancient Africa.",
    "The name 'Mancala' comes from the Arabic word 'naqala,' which means 'to move.'",
    "There are hundreds of variations of Mancala, with popular versions like Oware in West Africa and Bao in East Africa.",
    "In many cultures, Mancala was used to teach children arithmetic and strategic thinking.",
    "The game is traditionally played with seeds, beans, or small stones as playing pieces.",
    "The 'sowing' of seeds in the game is believed to have roots in agricultural symbolism and rituals.",
    "A popular West African variant, Oware, has its own proverbs, such as 'He who is too hungry will not win at Oware.'"
];

const funFactElement = document.getElementById('fun-fact');
let factInterval;

function startFactRotator() {
    if (!funFactElement) return;

    let currentFactIndex = 0;

    // Display the first fact immediately
    funFactElement.textContent = funFacts[currentFactIndex];

    // Function to display the next fact
    const displayNextFact = () => {
        currentFactIndex = (currentFactIndex + 1) % funFacts.length;
        funFactElement.style.opacity = 0; // Fade out
        setTimeout(() => {
            funFactElement.textContent = funFacts[currentFactIndex];
            funFactElement.style.opacity = 1; // Fade in
        }, 500); // Half a second for the fade transition
    };

    // Clear any existing interval before setting a new one
    if (factInterval) {
        clearInterval(factInterval);
    }
    
    // Set an interval to change the fact every 15 seconds
    factInterval = setInterval(displayNextFact, 15000);
}

// We will call this function from game.js when the game starts or resets.
// This gives us more control over when the rotator is active.
