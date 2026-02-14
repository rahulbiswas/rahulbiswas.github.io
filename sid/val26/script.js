// Configuration variables
var textContent = "Hello there!";
var isMobile = window.innerWidth <= 768;
var fontSize = isMobile ? "14vw" : "100px";
var fontFamily = "Brush Script MT, cursive";

var redButtonText = "Not interested";
var greenButtonText = "Interested";
var btnFontSize = isMobile ? "18px" : "24px";
var btnPadding = isMobile ? "12px 28px" : "15px 40px";

// Shared response for interested buttons
function showInterestedResponse() {
    // Create hearts/flowers falling transition
    var symbols = ["❤️", "💕", "🌸", "🌷", "💗", "🌹", "💖", "🌺"];

    for (var i = 0; i < 50; i++) {
        (function(index) {
            setTimeout(function() {
                var heart = document.createElement("div");
                heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                heart.style.position = "fixed";
                heart.style.left = Math.random() * 100 + "vw";
                heart.style.top = "-50px";
                heart.style.fontSize = (Math.random() * 30 + 20) + "px";
                heart.style.zIndex = "9999";
                heart.style.pointerEvents = "none";
                heart.style.transition = "top 2s ease-in, opacity 0.5s";
                document.body.appendChild(heart);

                setTimeout(function() {
                    heart.style.top = "110vh";
                }, 50);
            }, index * 40);
        })(i);
    }

    // Fade out and redirect
    setTimeout(function() {
        document.body.style.transition = "opacity 0.5s";
        document.body.style.opacity = "0";
    }, 1500);

    setTimeout(function() {
        window.location.href = "interested.html";
    }, 2000);
}

// Create text box
var textBox = document.createElement("div");
textBox.textContent = textContent;
textBox.style.position = "absolute";
textBox.style.top = "40%";
textBox.style.left = "50%";
textBox.style.transform = "translate(-50%, -50%)";
textBox.style.fontSize = fontSize;
textBox.style.fontFamily = fontFamily;
textBox.style.textAlign = "center";

document.body.appendChild(textBox);

// Create button container
var buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.top = "50%";
buttonContainer.style.left = "50%";
buttonContainer.style.transform = "translateX(-50%)";
buttonContainer.style.display = "flex";
buttonContainer.style.gap = "20px";

// Red button
var redButton = document.createElement("button");
redButton.textContent = redButtonText;
redButton.style.backgroundColor = "red";
redButton.style.color = "white";
redButton.style.padding = btnPadding;
redButton.style.fontSize = btnFontSize;
redButton.style.border = "none";
redButton.style.borderRadius = "10px";
redButton.style.cursor = "pointer";

redButton.onclick = function() {
    document.body.innerHTML = "";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";

    var warning = document.createElement("div");
    warning.textContent = "RECONSIDER";
    warning.style.fontSize = isMobile ? "12vw" : "80px";
    warning.style.fontWeight = "bold";
    warning.style.color = "white";
    document.body.appendChild(warning);

    var flash = true;
    var flashInterval = setInterval(function() {
        document.body.style.backgroundColor = flash ? "red" : "yellow";
        flash = !flash;
    }, 300);

    var interestedButton = document.createElement("button");
    interestedButton.textContent = "Interested now";
    interestedButton.style.position = "absolute";
    interestedButton.style.bottom = "30%";
    interestedButton.style.backgroundColor = "green";
    interestedButton.style.color = "white";
    interestedButton.style.padding = "15px 40px";
    interestedButton.style.fontSize = "24px";
    interestedButton.style.border = "none";
    interestedButton.style.borderRadius = "10px";
    interestedButton.style.cursor = "pointer";
    interestedButton.onclick = function() {
        clearInterval(flashInterval);
        document.body.style.backgroundColor = "lightpink";
        showInterestedResponse();
    };
    document.body.appendChild(interestedButton);
};

// Green button
var greenButton = document.createElement("button");
greenButton.textContent = greenButtonText;
greenButton.style.backgroundColor = "green";
greenButton.style.color = "white";
greenButton.style.padding = btnPadding;
greenButton.style.fontSize = btnFontSize;
greenButton.style.border = "none";
greenButton.style.borderRadius = "10px";
greenButton.style.cursor = "pointer";

greenButton.onclick = showInterestedResponse;

buttonContainer.appendChild(redButton);
buttonContainer.appendChild(greenButton);
document.body.appendChild(buttonContainer);
