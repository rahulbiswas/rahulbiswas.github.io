// Interested page script
var textContent = "Happy Valentine's Dayyyyy!";
var fontSize = "100px";
var fontFamily = "Brush Script MT, cursive";

// Valentine's buttons
var redButtonText = "No";
var greenButtonText = "Obviously";

// Video
var videoFile = "randomvideo.mov";
var audioFile = "videoaudio.mov";

// Images to display around the page
var images = [
    // Top corners
    { src: "penguin.jpg", top: "3%", left: "3%", rotation: -15 },
    { src: "heart.jpg", top: "3%", right: "3%", rotation: 15 },
    // Bottom corners
    { src: "bear.jpg", bottom: "3%", left: "3%", rotation: 10 },
    { src: "flowers.jpg", bottom: "3%", right: "3%", rotation: -10 },
    // Left side
    { src: "heart.jpg", top: "25%", left: "2%", rotation: -8 },
    { src: "flowers.jpg", top: "60%", left: "4%", rotation: 12 },
    // Right side
    { src: "penguin.jpg", top: "25%", right: "2%", rotation: 8 },
    { src: "bear.jpg", top: "60%", right: "4%", rotation: -12 },
    // Top middle area
    { src: "flowers.jpg", top: "8%", left: "25%", rotation: 5 },
    { src: "bear.jpg", top: "8%", right: "25%", rotation: -5 },
    // Bottom middle area
    { src: "heart.jpg", bottom: "8%", left: "25%", rotation: -7 },
    { src: "penguin.jpg", bottom: "8%", right: "25%", rotation: 7 }
];

// Track image positions for button avoidance
var imageRects = [];

// Create text box
var textBox = document.createElement("div");
textBox.textContent = textContent;
textBox.style.position = "absolute";
textBox.style.top = "40%";
textBox.style.left = "52%";
textBox.style.transform = "translate(-50%, -50%)";
textBox.style.fontSize = fontSize;
textBox.style.fontFamily = fontFamily;
textBox.style.textAlign = "center";

document.body.appendChild(textBox);

// Create button container
var buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.top = "55%";
buttonContainer.style.left = "52%";
buttonContainer.style.transform = "translateX(-50%)";
buttonContainer.style.display = "flex";
buttonContainer.style.gap = "20px";

// Red button
var redButton = document.createElement("button");
redButton.textContent = redButtonText;
redButton.style.backgroundColor = "red";
redButton.style.color = "white";
redButton.style.padding = "15px 40px";
redButton.style.fontSize = "24px";
redButton.style.border = "none";
redButton.style.borderRadius = "10px";
redButton.style.cursor = "pointer";
redButton.style.position = "fixed";
redButton.style.transition = "none";

// Detection radius around the button
var detectionRadius = 80;

function moveRedButton() {
    var maxX = window.innerWidth - 150;
    var maxY = window.innerHeight - 60;
    var randomX, randomY;
    var attempts = 0;

    // Try to find a position that doesn't overlap with images
    do {
        randomX = Math.floor(Math.random() * maxX);
        randomY = Math.floor(Math.random() * maxY);
        attempts++;
    } while (isOverlappingImage(randomX, randomY, 120, 50) && attempts < 20);

    redButton.style.left = randomX + "px";
    redButton.style.top = randomY + "px";
}

// Detect mouse proximity to button
document.addEventListener("mousemove", function(e) {
    var rect = redButton.getBoundingClientRect();
    var buttonCenterX = rect.left + rect.width / 2;
    var buttonCenterY = rect.top + rect.height / 2;

    var distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) +
        Math.pow(e.clientY - buttonCenterY, 2)
    );

    if (distance < detectionRadius + rect.width / 2) {
        moveRedButton();
    }
});

function isOverlappingImage(x, y, width, height) {
    for (var i = 0; i < imageRects.length; i++) {
        var rect = imageRects[i];
        if (x < rect.right && x + width > rect.left &&
            y < rect.bottom && y + height > rect.top) {
            return true;
        }
    }
    return false;
}

redButton.onclick = function() {
    // later
};

// Green button
var greenButton = document.createElement("button");
greenButton.textContent = greenButtonText;
greenButton.style.backgroundColor = "green";
greenButton.style.color = "white";
greenButton.style.padding = "15px 40px";
greenButton.style.fontSize = "24px";
greenButton.style.border = "none";
greenButton.style.borderRadius = "10px";
greenButton.style.cursor = "pointer";

greenButton.onclick = function() {
    playVideo();
};

function playVideo() {
    // Fade out current content
    document.body.style.transition = "opacity 1s ease-out";
    document.body.style.opacity = "0";

    // After fade out, replace with video
    setTimeout(function() {
        document.body.innerHTML = "";
        document.body.style.margin = "0";
        document.body.style.backgroundColor = "black";
        document.body.style.opacity = "1";

        // Create video element
        var video = document.createElement("video");
        video.src = videoFile;
        video.muted = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100vw";
        video.style.height = "100vh";
        video.style.objectFit = "contain";
        video.style.opacity = "0";
        video.style.transition = "opacity 1.5s ease-in";
        document.body.appendChild(video);

        // Create audio element for music
        var audio = document.createElement("audio");
        audio.src = audioFile;
        document.body.appendChild(audio);

        // Start playing video and audio, fade in video
        video.play();
        audio.play();
        setTimeout(function() {
            video.style.opacity = "1";
        }, 50);

        // When video ends, stop audio and show buttons
        video.onended = function() {
            audio.pause();
            audio.currentTime = 0;
            showVideoEndButtons(video, audio);
        };
    }, 1000);
}

function showVideoEndButtons(video, audio) {
    // Rewatch button (top left)
    var rewatchBtn = document.createElement("button");
    rewatchBtn.textContent = "Rewatch";
    rewatchBtn.style.position = "fixed";
    rewatchBtn.style.top = "20px";
    rewatchBtn.style.left = "20px";
    rewatchBtn.style.padding = "15px 30px";
    rewatchBtn.style.fontSize = "20px";
    rewatchBtn.style.backgroundColor = "rgba(255,255,255,0.9)";
    rewatchBtn.style.border = "none";
    rewatchBtn.style.borderRadius = "10px";
    rewatchBtn.style.cursor = "pointer";
    rewatchBtn.style.zIndex = "1000";
    rewatchBtn.onclick = function() {
        video.currentTime = 0;
        audio.currentTime = 0;
        video.play();
        audio.play();
        rewatchBtn.remove();
        doneBtn.remove();
        video.onended = function() {
            audio.pause();
            audio.currentTime = 0;
            showVideoEndButtons(video, audio);
        };
    };
    document.body.appendChild(rewatchBtn);

    // Done button (top right)
    var doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.style.position = "fixed";
    doneBtn.style.top = "20px";
    doneBtn.style.right = "20px";
    doneBtn.style.padding = "15px 30px";
    doneBtn.style.fontSize = "20px";
    doneBtn.style.backgroundColor = "rgba(255,255,255,0.9)";
    doneBtn.style.border = "none";
    doneBtn.style.borderRadius = "10px";
    doneBtn.style.cursor = "pointer";
    doneBtn.style.zIndex = "1000";
    doneBtn.onclick = function() {
        showCelebration();
    };
    document.body.appendChild(doneBtn);
}

function showCelebration() {
    document.body.innerHTML = "";
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "lightpink";
    document.body.style.overflow = "hidden";

    // Happy Valentine's Day text
    var message = document.createElement("div");
    message.textContent = "Happy Valentine's Day!";
    message.style.position = "fixed";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.fontSize = "80px";
    message.style.fontFamily = "Brush Script MT, cursive";
    message.style.textAlign = "center";
    message.style.color = "#d63384";
    message.style.zIndex = "100";
    document.body.appendChild(message);

    // Confetti and balloons
    var symbols = ["🎈", "🎊", "🎉", "❤️", "💕", "🎀", "💖", "🩷"];

    function createConfetti() {
        var confetti = document.createElement("div");
        confetti.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-50px";
        confetti.style.fontSize = (Math.random() * 30 + 20) + "px";
        confetti.style.zIndex = "50";
        confetti.style.pointerEvents = "none";
        document.body.appendChild(confetti);

        var duration = Math.random() * 3 + 2;
        confetti.style.transition = "top " + duration + "s linear";

        setTimeout(function() {
            confetti.style.top = "110vh";
        }, 50);

        setTimeout(function() {
            confetti.remove();
        }, duration * 1000 + 100);
    }

    // Keep spawning confetti
    setInterval(createConfetti, 150);

    // Initial burst
    for (var i = 0; i < 30; i++) {
        setTimeout(createConfetti, i * 50);
    }
}

buttonContainer.appendChild(greenButton);
document.body.appendChild(buttonContainer);
document.body.appendChild(redButton);

// Set initial position for both buttons centered as a pair
setTimeout(function() {
    var greenRect = greenButton.getBoundingClientRect();
    var redWidth = redButton.offsetWidth;
    var gap = 20;
    // Calculate so both buttons are centered together at 52%
    var totalWidth = redWidth + gap + greenRect.width;
    var centerX = window.innerWidth * 0.52;
    var redLeft = centerX - (totalWidth / 2);
    var greenLeft = redLeft + redWidth + gap;

    redButton.style.left = redLeft + "px";
    redButton.style.top = greenRect.top + "px";

    // Also reposition green button
    buttonContainer.style.left = greenLeft + "px";
    buttonContainer.style.transform = "none";
}, 10);

// Add images around the page
images.forEach(function(imgData) {
    var img = document.createElement("img");
    img.src = imgData.src;
    img.style.position = "absolute";
    img.style.width = "150px";
    img.style.height = "auto";
    img.style.borderRadius = "15px";
    img.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    img.style.transform = "rotate(" + imgData.rotation + "deg)";
    img.style.zIndex = "1";

    if (imgData.top) img.style.top = imgData.top;
    if (imgData.bottom) img.style.bottom = imgData.bottom;
    if (imgData.left) img.style.left = imgData.left;
    if (imgData.right) img.style.right = imgData.right;

    document.body.appendChild(img);

    // Track image position after it loads
    img.onload = function() {
        imageRects.push(img.getBoundingClientRect());
    };
});